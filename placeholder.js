"use strict";

define(function (require) {
   const placeholderManager = require("core/placeholderManager");
   
   var placeHolder = function ($scope, $element, controlService) {
         this.onClick = () => {
            console.log("Click!");
         };
   };
   
   placeholderManager.register("OrderAddress_ShippingFields", placeHolder);
});
