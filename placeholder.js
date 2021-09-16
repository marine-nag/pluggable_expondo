"use strict";

define(function (require) {
  
  $(document).ready(function ($scope) {
    const config = { childList: true, subtree: true };

    function searchTree(element, matchingTitle) {
     /*if (element.querySelectorAll("external-ui-component") && element.baseURI.indexOf("Scanner") > - 1) {
        console.log("Founded external-ui-component");
        return element.querySelectorAll("iframe")[0];*/
      
        if(element.innerText == "Company"){
          console.log("Company");
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
      return null;
    }

    var callback = function (mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          for (const node of mutation.addedNodes) {
            var result = searchTree(node, "external-ui-component");
            if (result) {
              console.log("Founded needed IFrame");
              console.log(result);
            //   result.insertAdjacentHTML(
            //     "beforeend",
            //     '<div><iframe src="https://application.doodle-products.com"></iframe></div>'
            //   );
              result.src = result.src + "&userName=" + session.userName;
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
