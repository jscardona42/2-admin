"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.UserService = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../../../../../../../src/prisma.service");
var bcrypt = require("bcrypt");
var apollo_server_express_1 = require("apollo-server-express");
var UserService = /** @class */ (function () {
    function UserService(prismaService, jwtService) {
        this.prismaService = prismaService;
        this.jwtService = jwtService;
    }
    UserService.prototype.findAllUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prismaService.user.findMany()];
            });
        });
    };
    UserService.prototype.signInUser = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var salt, user, _a, _b, token, updToken;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.prismaService.user.findFirst({
                            where: { email: data.email },
                            select: { salt: true }
                        })];
                    case 1:
                        salt = _e.sent();
                        _b = (_a = this.prismaService.user).findFirst;
                        _c = {};
                        _d = {
                            email: data.email
                        };
                        return [4 /*yield*/, this.hashPassword(data.password, salt.salt)];
                    case 2: return [4 /*yield*/, _b.apply(_a, [(_c.where = (_d.password = _e.sent(),
                                _d),
                                _c)])];
                    case 3:
                        user = _e.sent();
                        if (!user) {
                            throw new apollo_server_express_1.AuthenticationError('Invalid credentials');
                        }
                        token = this.jwtService.sign({ userId: user.id, role: user.role_id });
                        updToken = this.createToken(token, user);
                        return [2 /*return*/, updToken];
                }
            });
        });
    };
    UserService.prototype.signUpUser = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var salt, emailExists, user, _a, _b;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, bcrypt.genSalt()];
                    case 1:
                        salt = _e.sent();
                        return [4 /*yield*/, this.prismaService.user.findFirst({
                                where: { email: data.email },
                                select: { email: true }
                            })];
                    case 2:
                        emailExists = _e.sent();
                        if (emailExists) {
                            throw new apollo_server_express_1.UserInputError('El email ya se encuentra registrado');
                        }
                        _b = (_a = this.prismaService.user).create;
                        _c = {};
                        _d = {
                            email: data.email,
                            name: data.name
                        };
                        return [4 /*yield*/, this.hashPassword(data.password, salt)];
                    case 3:
                        user = _b.apply(_a, [(_c.data = (_d.password = _e.sent(),
                                _d.salt = salt,
                                _d.token = data.token,
                                _d.role_id = 3,
                                _d),
                                _c)]);
                        if (!user) {
                            throw new apollo_server_express_1.UserInputError('Error');
                        }
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UserService.prototype.hashPassword = function (password, salt) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, bcrypt.hash(password, salt)];
            });
        });
    };
    UserService.prototype.createToken = function (token, user) {
        return __awaiter(this, void 0, void 0, function () {
            var updToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prismaService.user.update({
                            where: { id: user.id },
                            data: { token: token },
                            select: { token: true }
                        })];
                    case 1:
                        updToken = _a.sent();
                        return [2 /*return*/, updToken];
                }
            });
        });
    };
    UserService = __decorate([
        common_1.Injectable()
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
