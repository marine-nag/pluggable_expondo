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
      debugger;	
   };
   
   
   var placeHolder = function ($scope, $element, $ctrl, controlService) {
      
         var self = this;
      
         $(this).ready(function($scope){
            debugger;	
           console.log("this in placeholder.");
         });
      
         this.onClick = () => {
            debugger;	
            console.log('Click!');
         };

         this.init = () => {
            debugger;	
           console.log('init');          
         };

         self.onInit = () => {
           console.log('onInit');    
            alert('onInit');  
            debugger;	
         };

         this.getItems = () => {
            var t = angular.module('Components');
            alert('getItems');
            debugger;	
            
            var items = [{
                placeholder: "Print Invoices",  // Button name
                key: "placeholderMandatoryTemplate1",  // Button id (unique)
                icon: "fa fa-print",  // Button icon
                type: "input",
                content: {
                    moduleName: "placeholderMandatoryTemplate1",
                    controlName: "placeholderMandatoryTemplate1"
                }
            }];

            return items;
            //return null;
         };
      
        this.isEnabled = (itemKey) => {
           debugger;	
            return false;
        };
   };
   
   placeholderManager.register("OrderAddress_ShippingFields", placeHolder);
   
   // ====
   
   $(document).ready(function ($scope) {
      
    console.log('Here!');
    const config = { childList: true, subtree: true };

    function searchTree(element, matchingTitle) {
      if (element.querySelectorAll("navigation right padding-left-none")) {
        console.log("Founded buttons");
        return element.querySelectorAll("button")[0];
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
              console.log("Founded needed !!! heeey :) ");
              console.log(result);
            
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
