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

                        //Find close button
                        var closeBtn = searchTree(node, "Close");
                        
                        if (closeBtn)
                        {
                            console.log('fuck');
                            closeBtn.parentNode.id = "OpenOrderCloseButton";
                            
                            var close_scp = angular.element(closeBtn).scope();
                            close_scp.validateEmail = (EmailAddress) => {
                                console.log(EmailAddress);
                                console.log(Boolean(EmailAddress.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)));
                                
                                return Boolean(EmailAddress.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/));
                                
                            };
                            
                            
                            close_scp.whatToFill = (){
                                
                                alert("Please, fill some fileds: \n sh \n bil \n 1 item");
                            
                            };
                            
                            //angular.element(closeBtn.parentNode).attr('id', );
                        }
                        
                        // Find SAVE button
                        var saveTxt = searchTree(node, " Save");
                        if (saveTxt) {
                            var btn = angular.element(saveTxt.parentNode);
                            
                           
                            
                             var newBtn = `<button class="primary wide" 
                                                onclick="
                                                
                                                var e = document.getElementById('OpenOrderCloseButton'); 
                                                if(e)
                                                {
                                                    var scp = angular.element(e).scope();
                                                    
                                                    var address = scp.order.CustomerInfo.Address;
                                                    
                                                    // TODO - Email validation
                                                    
                                                    var isValidEmailAddress = scp.validateEmail(address.EmailAddress);
                                                    
                                                    var isValidAddress = address.EmailAddress.length > 1 && isValidEmailAddress && address.Address1.length > 1 && address.Town.length > 1
                                                                && address.PostCode.length > 1 && (address.Company.length > 1 || address.FullName.length > 1);
                                                    
                                                    address = scp.order.CustomerInfo.BillingAddress;

                                                    var isValidEmailBillingAddress = scp.validateEmail(address.EmailAddress);
                                                    
                                                    var isValidBilling = address.EmailAddress.length > 1 && isValidEmailBillingAddress && address.Address1.length > 1 && address.Town.length > 1
                                                        && address.PostCode.length > 1 && (address.Company.length > 1 || address.FullName.length > 1);

                                                    var haveItems = scp.order.Items != null && scp.order.Items.length > 0;

                                                    var isGeneralInfo = scp.order.GeneralInfo.SubSource != '' && scp.order.GeneralInfo.SubSource != null;

                                                    var is_saving = isValidAddress && isValidBilling && haveItems && isGeneralInfo;
                                                    if (is_saving)
                                                    {
                                                        scp.saving.save_all();
                                                    
                                                        // Saved.
                                                        alert('Saved');
                                                    }
                                                    else
                                                    {
                                                        var whatToFill = '';
                                                        if(!isValidAddress) { whatToFill += '  Shipping address ';}
                                                        if(!isValidBilling) { whatToFill += ' Billing address ';}
                                                        if(!haveItems) { whatToFill += ' at least 1 order item ';}
                                                        if(!isGeneralInfo) { whatToFill += ' SubSource ';}
                                                        scp.whatToFill();
                                                        
                                                        //alert('Please, fill some fields: ' + whatToFill);
                                                    }
                                                   
                                                }
                                                
                                                
                                                                                                
                                                " >
                                <!---->
                                <span> <i class="fa fa-save"></i> Save ORDER</span><!---->
                            </button>`;

                             
                            var ctrl = angular.element(btn).controller();
                            
                            if (ctrl.options.viewName == "ViewOrder")
                            {
                                 var scp_new = btn.scope();

                                    var is_new = scp_new.config.is_new;

                                    if(is_new){
                                              var btn_save =  angular.element(saveTxt);
                                              btn_save.replaceWith(newBtn);   
                                    }
                                    else
                                    {
                                           
                                btn.replaceWith(newBtn);   
                                    }
                               
                            }
                            
                            
                            
                            
                            
                            var attrBtn = angular.element(btn).context.getAttribute('ng-disabled');

                            var attrBtnClick = angular.element(btn).context.getAttribute('ng-click');

                            if (attrBtnClick) {
                                // GET btn scope
                                var btnScp = angular.element(btn).scope();

                                var btnAng = angular.element(btn);

                                //btnScp.alert = window.alert;

                                // function (arg) {
                                //     alert(arg);
                                // };

                                // $scope.alert = window.alert;

                                // btnScp.check_order = function(){
                                //     console.log('checking....');
                                // };

                                // angular.element(btn).attr('ng-click', "check_order()");


                            }

                        }

                        // Get subsource 
                        var resultSubSource = searchTreeIncludes(node, "Subsource");

                        if (resultSubSource) {
                            if (!angular.element(resultSubSource).scope().locking.is_locked) {

                                $scope.input = resultSubSource.children[0].children[0].children[0].children[1].children[3];

                                $scope.selectedSubSource = angular.element(resultSubSource).scope().order.GeneralInfo.SubSource;

                                var sources = ["Email", "Phone", "PL Email", "PL Phone"];

                                if ($scope.input) {

                                    var subSourceCmbx = `<br/>
                                     <select id="cmbxSubSourceOpenOrder" 
                                             class="fill-width margin-bottom ng-pristine ng-untouched ng-valid ng-not-empty disabled-transparent"
                                             ng-model="order.Generalinfo.SubSource"
                                             onchange="var e = document.getElementById('cmbxSubSourceOpenOrder'); angular.element(e.parentNode.children[1]).scope().order.GeneralInfo.SubSource = e.options[e.selectedIndex].text;"
                                             required>`;

                                    subSourceCmbx += `<option value=" "> </option>`;

                                    for (var i = 0; i < sources.length; i++) {
                                        // Add new option
                                        if (sources[i] == $scope.selectedSubSource) {
                                            subSourceCmbx += `<option value="` + sources[i] + `" selected="selected">` + sources[i] + `</option>`;
                                        }
                                        else {
                                            subSourceCmbx += `<option value="` + sources[i] + `">` + sources[i] + `</option>`;
                                        }
                                    }

                                    subSourceCmbx += `</select>`;

                                    angular.element($scope.input).replaceWith(subSourceCmbx);

                                    var scp = angular.element(document.getElementById('cmbxSubSourceOpenOrder').parentNode.children[1]).scope();
                                }
                            }
                        }

                        //#region Shipping address

                        // Look for another fields ... 
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
                        var resultEmailBilling = searchTreeWithParent(node, "Email", "Billing Address");

                        var resultAddressBilling = searchTreeWithParent(node, "Address 1", "Billing Address");

                        var resultPostcodeBilling = searchTreeWithParent(node, "Postcode", "Billing Address");
                        var resultTownBilling = searchTreeWithParent(node, "Town", "Billing Address");

                        var resultAddBilling = searchTreeWithParent(node, "Address", "Billing Address");
                        var resultPhoneBilling = searchTreeWithParent(node, "Phone", "Billing Address");

                        ///
                        if (resultAddBilling) angular.element(resultAddBilling).context.setAttribute('style', "font-size:13px!important;");
                        if (resultPhoneBilling) resultPhoneBilling.innerText = "Phone ";

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
