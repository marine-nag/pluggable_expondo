"use strict";

define(function (require) {
   const placeholderManager = require("core/placeholderManager");
   
   require('modules/orderbook/orders/components/order-address/order-address.component');
   require('modules/orderbook/orders/components/dropdown-selector/dropdown-selector.component');
   
   const ngComponent = require("core/ngComponent");
   const template = require("text!./order-address.component.html");
   const angular = require('angular');
   
   
   this.onInit = () => {
      console.log('onInit outside.');   
      alert('onInit outside.');   
   };
   
   
   var placeHolder = function ($scope, $element, controlService) {
      
         var self = this;
      
         this.onClick = () => {
            console.log('Click!');
         };

         this.init = () => {
           console.log('init');          
         };

         self.onInit = () => {
           console.log('onInit');    
            alert('onInit');  
         };

         this.getItems = () => {
            var t = angular.module('Components');
            alert('getItems');
            
            
            var items = [{
                text: "Print Invoices",  // Button name
                key: "placeholderMandatoryTemplate",  // Button id (unique)
                icon: "fa fa-print",  // Button icon
                content: {
                    moduleName: "placeholderMandatoryTemplate",
                    controlName: "placeholderMandatoryTemplate"
                }
            }];

            return items;
            //return null;
         };
      
        this.isEnabled = (itemKey) => {
            return false;
        };
   };
   
   placeholderManager.register("OrderAddress_ShippingFields", placeHolder);
   
   // ====
   
    $(this).ready(function($scope){
        console.log("this");
    });
   
   
   $(document).ready(function ($scope) {
      
      console.log('Here!');
    const config = { childList: true, subtree: true };

    function searchTree(element, matchingTitle) {
      if (element.querySelectorAll("external-ui-component") && element.baseURI.indexOf("Scanner") > - 1) {
        console.log("Founded external-ui-component");
        return element.querySelectorAll("iframe")[0];
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
       console.log('callback!');
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

    console.log('observer');
      
    const observer = new MutationObserver(callback);

    const session = JSON.parse(window.localStorage.getItem('SPA_auth_session'));

    setTimeout(function () {
      const targetNode = document.getElementsByClassName("opened-modules")[0];
      observer.observe(targetNode, config);
    }, 2000);
  });
   
   
});
