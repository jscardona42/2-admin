"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.updateOrderInput = exports.createOrderInput = exports.Order = void 0;
require("reflect-metadata");
var graphql_1 = require("@nestjs/graphql");
var class_validator_1 = require("class-validator");
var Order = /** @class */ (function () {
    function Order() {
    }
    __decorate([
        graphql_1.Field(function (type) { return graphql_1.ID; })
    ], Order.prototype, "id");
    __decorate([
        graphql_1.Field(function (type) { return String; }),
        class_validator_1.IsNotEmpty()
    ], Order.prototype, "order");
    Order = __decorate([
        graphql_1.ObjectType()
    ], Order);
    return Order;
}());
exports.Order = Order;
var createOrderInput = /** @class */ (function () {
    function createOrderInput() {
    }
    __decorate([
        graphql_1.Field(),
        class_validator_1.IsNotEmpty()
    ], createOrderInput.prototype, "order");
    createOrderInput = __decorate([
        graphql_1.InputType({ description: "New order input" })
    ], createOrderInput);
    return createOrderInput;
}());
exports.createOrderInput = createOrderInput;
var updateOrderInput = /** @class */ (function () {
    function updateOrderInput() {
    }
    __decorate([
        graphql_1.Field(function (type) { return graphql_1.ID; }),
        class_validator_1.IsNotEmpty()
    ], updateOrderInput.prototype, "id");
    __decorate([
        graphql_1.Field(),
        class_validator_1.IsNotEmpty()
    ], updateOrderInput.prototype, "order");
    updateOrderInput = __decorate([
        graphql_1.InputType({ description: "Update order input" })
    ], updateOrderInput);
    return updateOrderInput;
}());
exports.updateOrderInput = updateOrderInput;
