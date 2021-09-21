"use strict";

define(function (require) {

    // Subsource dropdown
    var PlaceHolder = function ($scope, $element, $http, $timeout, $compile) {

        this.getItems = function () {
            //this is for fuzz, because he forgot to let me know that function should return empty array
            return [];
            //specially for fuzz and nik :)
        }

        this.constructor() = function () { };

        // controls
        let postCodeInput = `
        <input lw-tst="input_postalCode" list="postcodes" type="text" autocomplete="off" ng-disabled="sameAsShipping" tabindex="8" ng-model="address.PostCode" ng-change="changePostSearch()">
        <!----><button ng-if="!isBillingAddres" lw-tst="lookUp_postalCode" type="button" ng-click="lookUp($event,'POSTALCODE', address.PostCode);" class="btn"><i class="fa fa-search"></i></button><!---->
        <datalist id="postcodes">
          <option ng-repeat="item in postcodes" value="{{item}}">
        </datalist>
        `;

        const lookupControl = `
            <div class="control-group">
                <label class="control-label">Lookup:</label>
                <div class="controls controls-row">
                    <div class="input-append">
                        <input id="lookupAddressesInput" list="lookupAddresses" type="text" autocomplete="off"
                            ng-disabled="sameAsShipping || !selectedPostcode" tabindex="-1" ng-model="lookupAddress" ng-change="changeLookupAddress()">
                        <datalist id="lookupAddresses">
                    <option ng-repeat="item in lookupAddresses" value="{{item.formatted}}">
                        </datalist>
                    </div>
                </div>
            </div>
            `;
        const DEBOUNCE_TIME = 500;

        // current element (subSource)
        let subSourceInput = `<input class="fill-width margin-bottom ng-pristine ng-untouched ng-valid ng-empty" type="text" 
                                ng-model="order.GeneralInfo.SubSource" ng-disabled="locking.is_locked || order.GeneralInfo.Source != 'DIRECT'" 
                                ng-class="{'disabled-transparent': locking.is_locked}">`;

        // dropdown subsource
        const subSourcecmbx = `<select class="fill-width disabled-transparent upper-case ng-pristine ng-untouched ng-valid ng-not-empty" 
                                    ng-disabled="$ctrl.isLocked" ng-model="$ctrl.generalinfo.subsource" ng-change="$ctrl.update_subsource()" 
                                    data-hj-ignore-attributes="">
                   <!-- <option ng-repeat="country in $ctrl.countries" value="4079f09a-374c-4e9e-872b-1335c9e6cc40" data-hj-ignore-attributes="">
                        Afghanistan -->
                </select>`;



        let debounceTimer = null;

        const viewModule = angular.module("openOrdersViewService");

        viewModule.directive("div", function () {
            return {
                link: function (scope, elem, attrs) {
                    if (elem.context.children[0].getAttribute("lw-tst") === "input_postalCode") {
                        elem.empty();
                        elem.append($compile(postCodeInput)(scope));

                        $($compile(lookupControl)(scope)).insertAfter(elem.context.parentElement.parentElement);

                        $timeout(function () {
                            scope.$apply(function () {
                                scope.postcodes = [];
                                scope.lookupAddresses = [];
                                scope.selectedPostcode = undefined;
                            });
                        });

                        function findAddresses(postalCode) {
                            $timeout(function () {
                                scope.$apply(function () {
                                    scope.lookupAddresses = [];
                                });
                            });

                            $http({
                                method: 'GET',
                                url: 'https://postcodelookup.prodashes.com/addresses',
                                params: { postalCode }
                            }).then(function (response) {
                                const data = response.data;

                                $timeout(function () {
                                    scope.$apply(function () {
                                        scope.lookupAddresses = data.map(x => Object.assign({}, x, { formatted: `${x.address1}, ${x.address2}, ${x.address3}, ${x.town}, ${x.region}, ${x.country}` }));
                                        scope.selectedPostcode = postalCode;
                                        scope.lookupAddress = ""
                                    });
                                })
                            });
                        };

                        scope.changePostSearch = function () {
                            debounceTimer && $timeout.cancel(debounceTimer);
                            debounceTimer = $timeout(function () {
                                const postalCode = scope.address.PostCode;
                                const postcodes = scope.postcodes;

                                if (postcodes && postcodes.some(x => x === postalCode)) {
                                    findAddresses(postalCode);
                                }
                                else {
                                    $timeout(function () {
                                        scope.$apply(function () {
                                            scope.postcodes = [];
                                        });
                                    });
                                    $http({
                                        method: 'GET',
                                        url: 'https://postcodelookup.prodashes.com/autocomplete',
                                        params: { postalCode }
                                    }).then(function (response) {
                                        const data = response.data;

                                        $timeout(function () {
                                            scope.$apply(function () {
                                                scope.postcodes = data || [];
                                                scope.selectedPostcode = undefined;
                                            });
                                            $timeout(function () {
                                                if (data && Array.isArray(data) && data.some(x => x === postalCode)) {
                                                    findAddresses(postalCode);
                                                }
                                            });
                                        })
                                    });
                                }
                            }, DEBOUNCE_TIME);
                        };

                        scope.changeLookupAddress = function (e) {
                            const addresses = scope.lookupAddresses;

                            const value = scope.lookupAddress;
                            const address = addresses.find(x => x.formatted === value);
                            if (address) {
                                const country = address.country;
                                const foundCountry = scope.countries.find(c => c.CountryName === country);
                                $timeout(function () {
                                    scope.$apply(function () {
                                        scope.address.Address1 = address.address1;
                                        scope.address.Address2 = address.address2;
                                        scope.address.Address3 = address.address3;
                                        scope.address.Town = address.town;
                                        scope.address.Region = address.region;
                                        scope.address.CountryId = foundCountry && foundCountry.CountryId;
                                    });
                                });
                            }
                        };
                    }
                }
            };
        });
    };

    Core.PlaceHolderManager.register("OrderAddress_ShippingFields", PlaceHolder);

    // Set validation there
    $(document).ready(function ($scope) {
        const config = { childList: true, subtree: true };

        function searchTree(element, matchingTitle) {
            if (element.innerText == matchingTitle) {
                return element;
            }


            else if (element.children != null) {
                var i;
                var result = null;
                for (i = 0; result == null && i < element.children.length; i++) {
                    result = searchTree(element.children[i], matchingTitle);
                }
                return result;
            }
            return null;
        }

        function searchTreeWithParent(element, matchingTitle, parentNodeName) {
            if (element.innerText == matchingTitle && element.parentNode.parentNode.parentNode.parentNode.innerText.includes(parentNodeName)) {
                return element;
            }


            else if (element.children != null) {
                var i;
                var result = null;
                for (i = 0; result == null && i < element.children.length; i++) {
                    result = searchTree(element.children[i], matchingTitle);
                }
                return result;
            }
            return null;
        }

        var callback = function (mutationsList, observer) {
            for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    for (const node of mutation.addedNodes) {

                        // Find SAVE button
                        var saveTxt = searchTree(node, " Save");
                        if (saveTxt) {
                            var btn = angular.element(saveTxt.parentNode);
                            var attrBtn = angular.element(btn).context.getAttribute('ng-disabled');
debugger;
                            //btn.attr("ng-disabled", attrBtn + " || true"); 

                            console.log(btn);
                        }

                        // TODO: set unavailable SAVE button... 

                        //#region Shipping address

                        // Look for another fields ... 
                        var resultCompany = searchTree(node, "Company");
                        var resultName = searchTree(node, "Name");
                        var resultEmail = searchTree(node, "Email");

                        var resultAddress = searchTree(node, "Address 1");

                        var resultPostcode = searchTree(node, "Postcode");
                        var resultTown = searchTree(node, "Town");

                        var resultAdd = searchTree(node, "Address");
                        var resultPhone = searchTree(node, "Phone");

                        ///
                        if (resultAdd && resultAdd.nextElementSibling.tagName == "INPUT") angular.element(resultAdd).context.setAttribute('style', "font-size:13px!important;");
                        if (resultPhone && resultPhone.nextElementSibling.tagName == "INPUT") resultPhone.innerText = "Phone ";


                        if (resultName && resultName.nextElementSibling.tagName == "INPUT") {
                            resultName.innerText = "*" + resultName.innerText;

                            angular.element(resultName).context.setAttribute('style', "color:red!important;");

                            // At least on of the following fields should be filled  Name or Company Name
                            var nameInput = angular.element(resultName.nextElementSibling);
                            nameInput.context.setAttribute('minlength', '1');
                            nameInput.attr("required", "required");
                        }

                        if (resultCompany && resultCompany.nextElementSibling.tagName == "INPUT") {
                            resultCompany.innerText = "*" + resultCompany.innerText;
                            angular.element(resultCompany).context.setAttribute('style', "color:red!important;");

                            var companyInput = angular.element(resultCompany.nextElementSibling);
                            companyInput.context.setAttribute('minlength', '1');
                            companyInput.attr("required", "required");
                        }

                        if (resultEmail && resultEmail.nextElementSibling.tagName == "INPUT") {
                            resultEmail.innerText = "*" + resultEmail.innerText;
                            angular.element(resultEmail).context.setAttribute('style', "color:red!important;");

                            // email address => Cannot be empty (at least 1 character); Standard email validation of structure such as contains @, .
                            var emailInput = angular.element(resultEmail.nextElementSibling);
                            emailInput.context.setAttribute('minlength', '1');
                            emailInput.attr("required", "required");
                            emailInput.attr("type", "email");
                        }


                        // Address 1, Town, Postcode => Cannot be empty (at least 1 character)
                        if (resultAddress && resultAddress.nextElementSibling.tagName == "INPUT") {
                            resultAddress.innerText = "*" + resultAddress.innerText;
                            angular.element(resultAddress).context.setAttribute('style', "color:red!important;");
                            var addInput = angular.element(resultAddress.nextElementSibling);
                            addInput.context.setAttribute('minlength', '1');
                            addInput.attr("required", "required");
                        }

                        if (resultPostcode && resultPostcode.nextElementSibling.tagName == "INPUT") {
                            resultPostcode.innerText = "*" + resultPostcode.innerText;
                            angular.element(resultPostcode).context.setAttribute('style', "color:red!important;");

                            var codeInput = angular.element(resultPostcode.nextElementSibling);
                            codeInput.context.setAttribute('minlength', '1');
                            codeInput.attr("required", "required");
                        }

                        if (resultTown && resultTown.nextElementSibling.tagName == "INPUT") {
                            resultTown.innerText = "*" + resultTown.innerText;

                            angular.element(resultTown).context.setAttribute('style', "color:red!important;");

                            var townInput = angular.element(resultTown.nextElementSibling);
                            townInput.context.setAttribute('minlength', '1');
                            townInput.attr("required", "required");
                        }
                        //#endregion

                        // Sub source  
                        var resultSubSource = searchTree(node, "SubSource ");

                        if (resultSubSource) {
                            console.log("resultSubSource has been found! And how we transform it to dropdown?");
                            console.log(resultSubSource);
                            console.log(resultSubSource.nextElementSibling);
                        }


                        // TODO: Billing address fields

                        //#region Billing address
                        // Look for another fields ... 
                        var resultCompanyBilling = searchTreeWithParent(node, "Company", "Billing Address");
                        var resultNameBilling = searchTreeWithParent(node, "Name", "Billing Address");
                        var resultEmailBilling = searchTreeWithParent(node, "Email", "Billing Address");

                        var resultAddressBilling = searchTreeWithParent(node, "Address 1", "Billing Address");

                        var resultPostcodeBilling = searchTreeWithParent(node, "Postcode", "Billing Address");
                        var resultTownBilling = searchTreeWithParent(node, "Town", "Billing Address");

                        var resultAddBilling = searchTreeWithParent(node, "Address", "Billing Address");
                        var resultPhoneBilling = searchTreeWithParent(node, "Phone", "Billing Address");

                        ///
                        if (resultAddBilling) angular.element(resultAddBilling).context.setAttribute('style', "font-size:13px!important;");
                        if (resultPhoneBilling) resultPhoneBilling.innerText = "Phone ";


                        if (resultNameBilling && resultNameBilling.nextElementSibling.tagName == "INPUT") {
                            resultNameBilling.innerText = "*" + resultNameBilling.innerText;

                            angular.element(resultNameBilling).context.setAttribute('style', "color:red!important;");

                            // At least on of the following fields should be filled  Name or Company Name
                            var nameInput = angular.element(resultNameBilling.nextElementSibling);
                            nameInput.context.setAttribute('minlength', '1');
                            nameInput.attr("required", "required");
                        }

                        if (resultCompanyBilling && resultCompanyBilling.nextElementSibling.tagName == "INPUT") {
                            resultCompanyBilling.innerText = "*" + resultCompanyBilling.innerText;
                            angular.element(resultCompanyBilling).context.setAttribute('style', "color:red!important;");

                            var companyInput = angular.element(resultCompanyBilling.nextElementSibling);
                            companyInput.context.setAttribute('minlength', '1');
                            companyInput.attr("required", "required");
                        }

                        if (resultEmailBilling && resultEmailBilling.nextElementSibling.tagName == "INPUT") {
                            resultEmailBilling.innerText = "*" + resultEmailBilling.innerText;
                            angular.element(resultEmailBilling).context.setAttribute('style', "color:red!important;");

                            // email address => Cannot be empty (at least 1 character); Standard email validation of structure such as contains @, .
                            var emailInput = angular.element(resultEmailBilling.nextElementSibling);
                            emailInput.context.setAttribute('minlength', '1');
                            emailInput.attr("required", "required");
                            emailInput.attr("type", "email");
                        }


                        // Address 1, Town, Postcode => Cannot be empty (at least 1 character)
                        if (resultAddressBilling && resultAddressBilling.nextElementSibling.tagName == "INPUT") {
                            resultAddressBilling.innerText = "*" + resultAddressBilling.innerText;
                            angular.element(resultAddressBilling).context.setAttribute('style', "color:red!important;");
                            var addInput = angular.element(resultAddressBilling.nextElementSibling);
                            addInput.context.setAttribute('minlength', '1');
                            addInput.attr("required", "required");
                        }

                        if (resultPostcodeBilling && resultPostcodeBilling.nextElementSibling.tagName == "INPUT") {
                            resultPostcodeBilling.innerText = "*" + resultPostcodeBilling.innerText;
                            angular.element(resultPostcodeBilling).context.setAttribute('style', "color:red!important;");

                            var codeInput = angular.element(resultPostcodeBilling.nextElementSibling);
                            codeInput.context.setAttribute('minlength', '1');
                            codeInput.attr("required", "required");
                        }

                        if (resultTownBilling && resultTownBilling.nextElementSibling.tagName == "INPUT") {
                            resultTownBilling.innerText = "*" + resultTownBilling.innerText;

                            angular.element(resultTownBilling).context.setAttribute('style', "color:red!important;");

                            var townInput = angular.element(resultTownBilling.nextElementSibling);
                            townInput.context.setAttribute('minlength', '1');
                            townInput.attr("required", "required");
                        }
                        //#endregion
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);

        setTimeout(function () {
            const targetNode = document.getElementsByClassName("opened-modules")[0];
            observer.observe(targetNode, config);
        }, 2000);
    });
});
