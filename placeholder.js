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
                      
             var resultCompany = searchTree(node, "Company");
             var resultName = searchTree(node, "Name");
             var resultEmail = searchTree(node, "Email");
            
              var resultAddress = searchTree(node, "Address 1");
            
              var resultPostcode = searchTree(node, "Postcode");
              var resultTown = searchTree(node, "Town");
            
             if (resultCompany && resultName) {
               var t = angular.element(resultName.nextElementSibling);
               
               console.log(t);
               
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
