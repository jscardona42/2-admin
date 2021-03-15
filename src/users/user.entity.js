"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DeleteUserInput = exports.UpdateUserInput = exports.SignInUserInput = exports.SignUpUserInput = exports.User = void 0;
require("reflect-metadata");
var graphql_1 = require("@nestjs/graphql");
var class_validator_1 = require("class-validator");
var User = /** @class */ (function () {
    function User() {
    }
    __decorate([
        graphql_1.Field(function (type) { return graphql_1.ID; })
    ], User.prototype, "id");
    __decorate([
        graphql_1.Field(),
        class_validator_1.IsEmail(),
        class_validator_1.IsNotEmpty()
    ], User.prototype, "email");
    __decorate([
        graphql_1.Field(),
        class_validator_1.IsNotEmpty()
    ], User.prototype, "password");
    __decorate([
        graphql_1.Field(function (type) { return String; }, { nullable: true })
    ], User.prototype, "token");
    __decorate([
        graphql_1.Field(function (type) { return String; }, { nullable: true })
    ], User.prototype, "salt");
    __decorate([
        graphql_1.Field(function (type) { return String; }, { nullable: true })
    ], User.prototype, "name");
    __decorate([
        graphql_1.Field(function (type) { return Number; })
    ], User.prototype, "role_id");
    User = __decorate([
        graphql_1.ObjectType()
    ], User);
    return User;
}());
exports.User = User;
var SignUpUserInput = /** @class */ (function () {
    function SignUpUserInput() {
    }
    __decorate([
        graphql_1.Field(),
        class_validator_1.IsNotEmpty()
    ], SignUpUserInput.prototype, "name");
    __decorate([
        graphql_1.Field(),
        class_validator_1.IsEmail(),
        class_validator_1.IsNotEmpty()
    ], SignUpUserInput.prototype, "email");
    __decorate([
        graphql_1.Field(),
        class_validator_1.IsNotEmpty()
    ], SignUpUserInput.prototype, "password");
    __decorate([
        graphql_1.Field()
    ], SignUpUserInput.prototype, "roles");
    SignUpUserInput = __decorate([
        graphql_1.InputType({ description: "New User Input" })
    ], SignUpUserInput);
    return SignUpUserInput;
}());
exports.SignUpUserInput = SignUpUserInput;
var SignInUserInput = /** @class */ (function () {
    function SignInUserInput() {
    }
    __decorate([
        graphql_1.Field(),
        class_validator_1.IsEmail()
    ], SignInUserInput.prototype, "email");
    __decorate([
        graphql_1.Field()
    ], SignInUserInput.prototype, "password");
    SignInUserInput = __decorate([
        graphql_1.InputType()
    ], SignInUserInput);
    return SignInUserInput;
}());
exports.SignInUserInput = SignInUserInput;
var UpdateUserInput = /** @class */ (function () {
    function UpdateUserInput() {
    }
    __decorate([
        graphql_1.Field()
    ], UpdateUserInput.prototype, "id");
    __decorate([
        graphql_1.Field(),
        class_validator_1.IsNotEmpty()
    ], UpdateUserInput.prototype, "name");
    UpdateUserInput = __decorate([
        graphql_1.InputType()
    ], UpdateUserInput);
    return UpdateUserInput;
}());
exports.UpdateUserInput = UpdateUserInput;
var DeleteUserInput = /** @class */ (function () {
    function DeleteUserInput() {
    }
    __decorate([
        graphql_1.Field()
    ], DeleteUserInput.prototype, "id");
    DeleteUserInput = __decorate([
        graphql_1.InputType()
    ], DeleteUserInput);
    return DeleteUserInput;
}());
exports.DeleteUserInput = DeleteUserInput;
