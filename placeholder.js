"use strict";

define(function (require) {
   const placeholderManager = require("core/placeholderManager");
   
   require('modules/orderbook/orders/components/order-address/order-address.component');
   require('modules/orderbook/orders/components/dropdown-selector/dropdown-selector.component');
   
   const ngComponent = require("core/ngComponent");
   const template = require("text!./order-address.component.html");
   const angular = require('angular');
   
   
   this.onInit = () => {
      console.log("onInit outside.");   
      alert("onInit outside.");   
   };
   
   
   var placeHolder = function ($scope, $element, controlService) {
      
         var self = this;
      
         this.onClick = () => {
            console.log("Click!");
         };

         this.init = () => {
           console.log("init");          
         };

         self.onInit = () => {
           console.log("onInit");    
            alert("onInit");  
         };

         this.getItems = () => {
            var t = angular.module('Components');
            
           return null;
         };
   };
   
   placeholderManager.register("OrderAddress_ShippingFields", placeHolder);
});
