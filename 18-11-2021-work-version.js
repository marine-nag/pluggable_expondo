"use strict";

//const { ifError } = require("assert");

//const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require("constants");

define(function (require) {

    //const OrderChangeState = require('modules/orderbook/orders/classes/orderchangestate');

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

        function searchTreeIncludes(element, matchingTitle) {
            if (element) {
                if (element.innerText) {
                    if (element.innerText.includes(matchingTitle)) {
                        return element;
                    }
                }
                else if (element.children != null) {
                    var i;
                    var result = null;
                    for (i = 0; result == null && i < element.children.length; i++) {
                        result = searchTree(element.children[i], matchingTitle);
                    }
                    return result;
                }
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

            function onChangeSubSource() {
                console.log("onChangeSubSource");
            };

            for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    for (const node of mutation.addedNodes) {

                        // Find SAVE button
                        var saveTxt = searchTree(node, " Save");
                        if (saveTxt) {
                            var btn = angular.element(saveTxt.parentNode);
                            var attrBtn = angular.element(btn).context.getAttribute('ng-disabled');

                            // GET btn scope
                            var scp = angular.element(btn).scope();

                            scp.elSave = btn;

                            var is_new = Boolean(scp.config.is_new);

                            if (is_new) {
                                scp.saving.is_saving = () => {

                                    scp.change_state.has_order_changed = (order) => {
                                        var address = scp.$parent.$parent.order.CustomerInfo.Address;

                                        var isValidEmail = address.EmailAddress.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

                                        var isValidAddress = address.EmailAddress.length > 1 && isValidEmail && address.Address1.length > 1 && address.Town.length > 1
                                            && address.PostCode.length > 1 && (address.Company.length > 1 || address.FullName.length > 1);

                                        address = scp.$parent.$parent.order.CustomerInfo.BillingAddress;

                                        isValidEmail = address.EmailAddress.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

                                        var isValidBilling = address.EmailAddress.length > 1 && isValidEmail && address.Address1.length > 1 && address.Town.length > 1
                                            && address.PostCode.length > 1 && (address.Company.length > 1 || address.FullName.length > 1);

                                        var haveItems = scp.$parent.$parent.order.Items != null && scp.$parent.$parent.order.Items.length > 0;

                                        var isGeneralInfo = scp.$parent.$parent.order.GeneralInfo.SubSource != "" && scp.$parent.$parent.order.GeneralInfo.SubSource != null;

                                        var is_saving = isValidAddress && isValidBilling && haveItems && isGeneralInfo;

                                        return is_saving;
                                    };

                                    return this.chain != null;
                                }
                            }
                            else if (scp.change_state) {
                                scp.change_state.has_order_changed = (order) => {
                                    var t1 = scp.change_state.has_general_info_changed(order.GeneralInfo);
                                    var t2 = scp.change_state.have_items_changed(order.Items);
                                    var t3 = scp.change_state.has_address_changed(order.CustomerInfo.Address);
                                    var t4 = scp.change_state.has_billing_address_changed(order.CustomerInfo.BillingAddress);

                                    if (scp.change_state.has_general_info_changed(order.GeneralInfo)
                                        && scp.change_state.have_items_changed(order.Items)
                                        && scp.change_state.has_address_changed(order.CustomerInfo.Address)
                                        && scp.change_state.has_billing_address_changed(order.CustomerInfo.BillingAddress)) {

                                        if (scp.change_state.has_shipping_info_changed(order.ShippingInfo)) {
                                            return true;
                                        }

                                        if (scp.change_state.have_totals_changed(order.TotalsInfo)) {
                                            return true;
                                        }
                                        if (scp.change_state.have_extended_properties_changed(order.ExtendedProperties || [])) {
                                            return true;
                                        }

                                        return true;
                                    }
                                    else {
                                        return false;
                                    }
                                };

                                // Shipping address
                                /*scp.change_state.has_shipping_info_changed = shipping => {
    
                                    if (!shipping) return false;
    
                                    var address = shipping;
    
                                    var isValid = address.EmailAddress.length > 1 && address.Address1.length > 1 && address.Town.length > 1
                                    && address.PostCode.length > 1 && (address.Company.length > 1 || address.FullName.length > 1);
    
                                    return this._object_is_different(scp.change_state.shipping_excluded_fields, scp.change_state.original_shipping, shipping) && isValid;
                                };*/

                                // Billing address
                                scp.change_state.has_billing_address_changed = address => {
                                    // if (!address) return false;
                                    // return scp.change_state._object_is_different([], scp.change_state.original_billing, address);

                                    if (!address) return false;
                                    var isValidEmail = address.EmailAddress.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

                                    var isValid = address.EmailAddress.length > 1 && isValidEmail && address.Address1.length > 1 && address.Town.length > 1
                                        && address.PostCode.length > 1 && (address.Company.length > 1 || address.FullName.length > 1);

                                    // return scp.change_state._object_is_different([], scp.change_state.original_billing, address)
                                    //     || isValid

                                    return isValid;
                                }

                                // General info (subsource there)
                                scp.change_state.has_general_info_changed = general_info => {
                                    if (!general_info) return false;

                                    if (general_info.SubSource == "" || general_info.SubSource == null) {
                                        return false;
                                    }
                                    else {
                                        return true;
                                    }

                                    return scp.change_state._object_is_different(scp.change_state.general_excluded_fields, scp.change_state.original_general, general_info);
                                }

                                // At least 1 item has to be there.. 
                                scp.change_state.have_items_changed = (items, ignore_service = false) => {

                                    var realCount = scp.items.get_items_count();
                                    if (realCount == 0) return false;

                                    let item_count = Object.keys(scp.change_state.original_items).length;
                                    let check_items = [];

                                    if (ignore_service) {
                                        for (let item of items) {
                                            if (!(item.IsService || item.IsServiceItem)) {
                                                check_items.push(item);
                                            }
                                        }
                                    }
                                    else {
                                        item_count += Object.keys(scp.change_state.original_services).length;
                                        check_items = items;
                                    }

                                    if (item_count != check_items.length) {
                                        return true;
                                    }

                                    for (let item of check_items) {
                                        let original_item = scp.change_state.get_original_item(item.RowId);
                                        if (!original_item) return true;

                                        if (scp.change_state.has_item_changed(item)) {
                                            return true;
                                        }
                                    }

                                    return true;
                                };

                                // Customer address...
                                scp.change_state.has_address_changed = address => {
                                    if (!address) return false;
                                    
                                    var isValidEmail = address.EmailAddress.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

                                    var isValid = address.EmailAddress.length > 1 && isValidEmail && address.Address1.length > 1 && address.Town.length > 1
                                        && address.PostCode.length > 1 && (address.Company.length > 1 || address.FullName.length > 1);

                                    // return scp.change_state._object_is_different([], scp.change_state.original_customer, address)
                                    //     || isValid

                                    return isValid;
                                };
                            }
                        }

                        // Get subsource 
                        var resultSubSource = searchTreeIncludes(node, "Subsource");

                        if (resultSubSource) {
                            if (!angular.element(resultSubSource).scope().locking.is_locked) {

                                $scope.input = resultSubSource.children[0].children[0].children[0].children[1].children[3];

                                const dashService = new Services.DashboardsService(this);

                                var query = "SELECT DISTINCT o.SubSource From [Order] o ORDER BY o.SubSource";
                                $scope.selectedSubSource = angular.element(resultSubSource).scope().order.GeneralInfo.SubSource;

                                $scope.subsources = [];

                                dashService.ExecuteCustomScriptQuery(query, function (data) {
                                    //subsources = data.Results;
                                    for (var i = 0; i < data.result.Results.length; i++) {
                                        var item = data.result.Results[i];

                                        $scope.subsources.push(item.SubSource);
                                    }

                                    if ($scope.input && $scope.subsources.length && $scope.subsources.length > 0) {

                                        var subSourceCmbx = `<br/>
                                         <select id="cmbxSubSourceOpenOrder" 
                                                 class="fill-width margin-bottom ng-pristine ng-untouched ng-valid ng-not-empty disabled-transparent"
                                                 ng-model="order.Generalinfo.SubSource"
                                                 onchange="var e = document.getElementById('cmbxSubSourceOpenOrder'); angular.element(e.parentNode.children[1]).scope().order.GeneralInfo.SubSource = e.options[e.selectedIndex].text;"
                                                 required>`;

                                        //subSourceCmbx += `<option value="` + $scope.subsources[i] + `">` + $scope.subsources[i] + `</option>`;
                                        subSourceCmbx += `<option value=" "> </option>`;
                                        subSourceCmbx += `<option value="Email" selected="selected">Email</option>`;
                                        subSourceCmbx += `<option value="Phone">Phone</option>`;
                                        subSourceCmbx += `<option value="PL Email">PL Email</option>`;
                                        subSourceCmbx += `<option value="PL Phone">PL Phone</option>`;
                                        
                                        /*for (var i = 0; i < $scope.subsources.length; i++) {

                                            // Add new option
                                            if ($scope.subsources[i] == $scope.selectedSubSource) {
                                                subSourceCmbx += `<option value="` + $scope.subsources[i] + `" selected="selected">` + $scope.subsources[i] + `</option>`;
                                            }
                                            else {
                                                subSourceCmbx += `<option value="` + $scope.subsources[i] + `">` + $scope.subsources[i] + `</option>`;
                                            }
                                        }*/
                                        /*if(!scope.locking.is_locked)
                                        {
     disabled = "angular.element(document.getElementById('cmbxSubSourceOpenOrder').parentNode.children[1]).scope().locking.is_locked"
                                        }*/

                                        subSourceCmbx += `</select>`;

                                        angular.element($scope.input).replaceWith(subSourceCmbx);

                                        var scp = angular.element(document.getElementById('cmbxSubSourceOpenOrder').parentNode.children[1]).scope();
                                        var loc = scp.locking.is_locked;
                                    }
                                });
                            }
                        }

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
                        if (resultAdd) {
                            if (resultAdd.nextElementSibling.tagName == "INPUT") angular.element(resultAdd).context.setAttribute('style', "font-size:13px!important;");
                        }

                        if (resultPhone) {
                            if (resultPhone.nextElementSibling.tagName == "INPUT") resultPhone.innerText = "Phone ";
                        }


                        if (resultName) {
                            if (resultName.nextElementSibling.tagName == "INPUT") {
                                resultName.innerText = "*" + resultName.innerText;

                                angular.element(resultName).context.setAttribute('style', "color:red!important;");

                                // At least on of the following fields should be filled  Name or Company Name
                                var nameInput = angular.element(resultName.nextElementSibling);
                                nameInput.context.setAttribute('minlength', '1');
                                nameInput.attr("required", "required");
                            }
                        }

                        if (resultCompany) {
                            if (resultCompany.nextElementSibling.tagName == "INPUT") {
                                resultCompany.innerText = "*" + resultCompany.innerText;
                                angular.element(resultCompany).context.setAttribute('style', "color:red!important;");

                                var companyInput = angular.element(resultCompany.nextElementSibling);
                                companyInput.context.setAttribute('minlength', '1');
                                companyInput.attr("required", "required");
                            }
                        }

                        if (resultEmail) {
                            if (resultEmail.nextElementSibling.tagName == "INPUT") {
                                resultEmail.innerText = "*" + resultEmail.innerText;
                                angular.element(resultEmail).context.setAttribute('style', "color:red!important;");

                                // email address => Cannot be empty (at least 1 character); Standard email validation of structure such as contains @, .
                                var emailInput = angular.element(resultEmail.nextElementSibling);
                                emailInput.context.setAttribute('minlength', '1');
                                emailInput.attr("required", "required");
                                emailInput.attr("type", "email");
                            }
                        }


                        // Address 1, Town, Postcode => Cannot be empty (at least 1 character)
                        if (resultAddress) {
                            if (resultAddress.nextElementSibling.tagName == "INPUT") {
                                resultAddress.innerText = "*" + resultAddress.innerText;
                                angular.element(resultAddress).context.setAttribute('style', "color:red!important;");
                                var addInput = angular.element(resultAddress.nextElementSibling);
                                addInput.context.setAttribute('minlength', '1');
                                addInput.attr("required", "required");
                            }
                        }

                        if (resultPostcode) {
                            if (resultPostcode.nextElementSibling.tagName == "INPUT") {
                                resultPostcode.innerText = "*" + resultPostcode.innerText;
                                angular.element(resultPostcode).context.setAttribute('style', "color:red!important;");

                                var codeInput = angular.element(resultPostcode.nextElementSibling);
                                codeInput.context.setAttribute('minlength', '1');
                                codeInput.attr("required", "required");
                            }
                        }

                        if (resultTown) {
                            if (resultTown.nextElementSibling.tagName == "INPUT") {
                                resultTown.innerText = "*" + resultTown.innerText;

                                angular.element(resultTown).context.setAttribute('style', "color:red!important;");

                                var townInput = angular.element(resultTown.nextElementSibling);
                                townInput.context.setAttribute('minlength', '1');
                                townInput.attr("required", "required");
                            }
                        }
                        //#endregion

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
