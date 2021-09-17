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
              
              btn.attr("ng-disabled", attrBtn + " || true"); 
              
              console.log(btn);
            }
            
            // set unavailable SAVE button... 
            
            
                      
             var resultCompany = searchTree(node, "Company");
             var resultName = searchTree(node, "Name");
             var resultEmail = searchTree(node, "Email");
            
              var resultAddress = searchTree(node, "Address 1");
            
              var resultPostcode = searchTree(node, "Postcode");
              var resultTown = searchTree(node, "Town");
            
             if (resultCompany && resultName) {
                // At least on of the followinf fields should be filled  Name or Company Name
                var nameInput = angular.element(resultName.nextElementSibling);
                nameInput.context.setAttribute('minlength', '1');
                nameInput.attr("required","required");
               
                var companyInput = angular.element(resultCompany.nextElementSibling);
                companyInput.context.setAttribute('minlength', '1');
                companyInput.attr("required","required");
                
                // email address => Cannot be empty (at least 1 character); Standard email validation of structure such as contains @, .
                var emailInput = angular.element(resultEmail.nextElementSibling);
                emailInput.context.setAttribute('minlength', '1');
                emailInput.attr("required","required");
                emailInput.attr("type","email");
               
                // Address 1, Town, Postcode => Cannot be empty (at least 1 character)
                var addInput = angular.element(resultAddress.nextElementSibling);
                addInput.context.setAttribute('minlength', '1');
                addInput.attr("required","required");
               
                var codeInput = angular.element(resultPostcode.nextElementSibling);
                codeInput.context.setAttribute('minlength', '1');
                codeInput.attr("required","required");
               
                var townInput = angular.element(resultTown.nextElementSibling);
                townInput.context.setAttribute('minlength', '1');
                townInput.attr("required","required");
               
               
                
                /*var el1 = angular.element(resultName).attr('ng-class');

               resultName.innerText += " *";
               
               angular.element(resultName).attr('ng-class', el1);

               resultCompany.innerText += " *";
               
               
                var inputCompany = resultCompany.nextElementSibling;
               
               if(inputCompany)
               {
                    var at2 = angular.element(resultCompany.nextElementSibling).context.getAttribute('class');

                    at2.replace('ng-valid', '');
                    angular.element(resultCompany.nextElementSibling).context.setAttribute('class', at2 + ' ng-invalid');
               }
               
               
               
               // console.log(input);
              console.log("resultEmail:");
               console.log(resultEmail.nextElementSibling);
               
               
               console.log("resultAddress:");
                console.log(resultAddress.nextElementSibling);
               
               console.log("resultPostcode:");
                console.log(resultPostcode.nextElementSibling);
               
                console.log("resultTown:");
                console.log(resultTown.nextElementSibling);
               
                 if(resultTown)
                {
                    var at1 = angular.element(resultTown.nextElementSibling).context.getAttribute('class');

                    at1.replace('ng-valid', '');
                    angular.element(resultTown.nextElementSibling).context.setAttribute('class', at1 + ' ng-invalid');
                }*/
               
                return;
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
