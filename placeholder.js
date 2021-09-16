"use strict";

define(function (require) {
  
  const ngComponent = require("core/ngComponent");
   const template = require("text!./order-address.component.html");
   const angular = require('angular');
  
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
            
             if (resultCompany) {
               // console.log("Founded needed. :) ");
                //console.log(resultCompany);

                var inputCompany = resultCompany.nextElementSibling;
                
               var t = angular;
               // console.log(input);
               console.log("resultEmail:");
               console.log(resultEmail.nextElementSibling);
               
               
               console.log("resultAddress:");
                console.log(resultAddress.nextElementSibling);
               
               console.log("resultPostcode:");
                console.log(resultPostcode.nextElementSibling);
               
                console.log("resultTown:");
                console.log(resultTown.nextElementSibling);
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
