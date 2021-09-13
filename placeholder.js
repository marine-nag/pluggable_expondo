"use strict";

define(function (require) {
   const placeholderManager = require("core/placeholderManager");
   
   var placeHolder = function ($scope, $element, controlService) {
         this.onClick = () => {
            console.log("Click!");
         };

         this.init = () => {
           console.log("init");          
         };

      
         this.onInit = () => {
           console.log("onInit");          
         };

         this.getItems = () => {

                     return null;
         };
   };
   
   placeholderManager.register("OrderAddress_ShippingFields", placeHolder);
});
