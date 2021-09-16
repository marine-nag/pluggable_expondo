"use strict";

define(function (require) {
  
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
            
            //var resultEmail = searchTree(node, "Email");
            
            //var resultAddress = searchTree(node, "Address 1");
            
            //var resultPostcode = searchTree(node, "Postcode");
            //var resultTown = searchTree(node, "Town");
            
            // Set same validation == At least on of the following fields should be 
            /*if(resultEmail && resultAddress)
            {
              console.log(resultEmail);
              console.log(resultAddress);
              console.log(resultPostcode);
              console.log(resultTown);
            }*/
            
            if (resultCompany && resultName) {
              //console.log("Founded needed. :) ");
              //console.log(resultCompany);
              
              var input = resultCompany.nextElementSibling;
              console.log(input);
              
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
