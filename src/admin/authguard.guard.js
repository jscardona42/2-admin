"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.GqlAuthGuard = void 0;
var common_1 = require("@nestjs/common");
var graphql_1 = require("@nestjs/graphql");
var passport_1 = require("@nestjs/passport");
var jwt = require("jsonwebtoken");
var GqlAuthGuard = /** @class */ (function (_super) {
    __extends(GqlAuthGuard, _super);
    function GqlAuthGuard(reflector, prismaService) {
        var _this = _super.call(this) || this;
        _this.reflector = reflector;
        _this.prismaService = prismaService;
        return _this;
    }
    GqlAuthGuard.prototype.canActivate = function (context) {
        return __awaiter(this, void 0, void 0, function () {
            var ctx, req, tkn, token, _class, permissionsReq, permissions, _a, _b, perExists, user;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        ctx = graphql_1.GqlExecutionContext.create(context);
                        req = ctx.getContext().req;
                        tkn = req.headers.authorization.split(' ')[1];
                        token = jwt.verify(tkn, 'topSecret');
                        _class = context.getClass().name;
                        permissionsReq = context.getHandler().name;
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, this.getPermissions(token)];
                    case 1:
                        permissions = _b.apply(_a, [_c.sent()]);
                        perExists = permissions.filter(function (permiss) { return permiss === permissionsReq; });
                        return [4 /*yield*/, this.validate(token, tkn)];
                    case 2:
                        user = _c.sent();
                        console.log(permissions);
                        if (user == null || token == null || perExists.length === 0) {
                            throw new common_1.UnauthorizedException("Usuario no autorizado");
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    GqlAuthGuard.prototype.getPermissions = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var rolePermissions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prismaService.roles_permissions.findFirst({
                            where: { role_id: token.role }
                        })];
                    case 1:
                        rolePermissions = _a.sent();
                        return [2 /*return*/, rolePermissions.permissions];
                }
            });
        });
    };
    GqlAuthGuard.prototype.validate = function (token, tkn) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prismaService.user.findFirst({ where: { id: token.userId, token: tkn } })
                        // if (!user) {
                        //     throw new UnauthorizedException("El usuario no existe o el token es incorrecto")
                        // }
                    ];
                    case 1:
                        user = _a.sent();
                        // if (!user) {
                        //     throw new UnauthorizedException("El usuario no existe o el token es incorrecto")
                        // }
                        return [2 /*return*/, user];
                }
            });
        });
    };
    GqlAuthGuard = __decorate([
        common_1.Injectable()
    ], GqlAuthGuard);
    return GqlAuthGuard;
}(passport_1.AuthGuard('jwt')));
exports.GqlAuthGuard = GqlAuthGuard;
