"use strict";

define(function (require) {
  
 //const ngComponent = require("core/ngComponent");
   //const template = require("text!./order-address.component.html");
   //const angular = require('angular');
  
  $(document).ready(function ($scope) {
    const config = { childList: true, subtree: true };

    function searchTree(element, matchingTitle) {
        if(element.innerText == matchingTitle){
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
            if(saveTxt) {
              var btn = angular.element(saveTxt.parentNode);
              var attrBtn = angular.element(btn).context.getAttribute('ng-disabled');
              
              //btn.attr("ng-disabled", attrBtn + " || true"); 
              
              console.log(btn);
            }
            
            // set unavailable SAVE button... 
            
            
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
            if (resultAdd) angular.element(resultAdd).context.setAttribute('style', "font-size:13px!important;");
            if (resultPhone) resultPhone.innerText = "Phone ";
            
            
            if (resultName) {              
                resultName.innerText = "*" + resultName.innerText;
                           
                angular.element(resultName).context.setAttribute('style', "color:red!important;");
              
                // At least on of the following fields should be filled  Name or Company Name
                var nameInput = angular.element(resultName.nextElementSibling);
                nameInput.context.setAttribute('minlength', '1');
                nameInput.attr("required","required");
            }
            
            if (resultCompany){
              resultCompany.innerText = "*" + resultCompany.innerText;
              angular.element(resultCompany).context.setAttribute('style', "color:red!important;");
              
              var companyInput = angular.element(resultCompany.nextElementSibling);
                companyInput.context.setAttribute('minlength', '1');
                companyInput.attr("required","required");
            }
            
            if (resultEmail) {
              resultEmail.innerText = "*" + resultEmail.innerText;
              angular.element(resultEmail).context.setAttribute('style', "color:red!important;");
              
               // email address => Cannot be empty (at least 1 character); Standard email validation of structure such as contains @, .
                var emailInput = angular.element(resultEmail.nextElementSibling);
                emailInput.context.setAttribute('minlength', '1');
                emailInput.attr("required","required");
                emailInput.attr("type","email");
            }
            
            
            // Address 1, Town, Postcode => Cannot be empty (at least 1 character)
            if (resultAddress) {
              resultAddress.innerText = "*" + resultAddress.innerText;
              angular.element(resultAddress).context.setAttribute('style', "color:red!important;");
               var addInput = angular.element(resultAddress.nextElementSibling);
                  addInput.context.setAttribute('minlength', '1');
                  addInput.attr("required","required");
            }
            
            if (resultPostcode) {
              resultPostcode.innerText = "*" + resultPostcode.innerText;
              angular.element(resultPostcode).context.setAttribute('style', "color:red!important;");
              
              var codeInput = angular.element(resultPostcode.nextElementSibling);
                  codeInput.context.setAttribute('minlength', '1');
                  codeInput.attr("required","required");
            }
            
            if (resultTown) {
              resultTown.innerText = "*" + resultTown.innerText;
              
              angular.element(resultTown).context.setAttribute('style', "color:red!important;");
              
              var townInput = angular.element(resultTown.nextElementSibling);
                  townInput.context.setAttribute('minlength', '1');
                  townInput.attr("required","required");
            }
            
            
            // Sub source 
            var resultSubSource = searchTree(node, "SubSource");
            
            if (resultSubSource)
            {
                console.log("resultSubSource has been found! And how we transform it to dropdown?");
                console.log(resultSubSource);
                console.log(resultSubSource.nextElementSibling);
            }                              
          }
        }
      }
    };

    const observer = new MutationObserver(callback);

    const session = JSON.parse(window.localStorage.getItem('SPA_auth_session'));

    setTimeout(function () {
      const targetNode = document.getElementsByClassName("opened-modules")[0];
      observer.observe(targetNode, config);
    }, 2000);
  });
});
