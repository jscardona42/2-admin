"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var graphql_1 = require("@nestjs/graphql");
var jwt_1 = require("@nestjs/jwt");
var passport_1 = require("@nestjs/passport");
var path_1 = require("path");
var admin_resolver_1 = require("./admin/admin.resolver");
var admin_service_1 = require("./admin/admin.service");
var order_resolver_1 = require("./orders/order.resolver");
var prisma_service_1 = require("./prisma.service");
var user_entity_1 = require("./users/user.entity");
var user_resolver_1 = require("./users/user.resolver");
var user_service_1 = require("./users/user.service");
var MyProviders = [prisma_service_1.PrismaService, admin_service_1.AdminService, user_service_1.UserService, user_resolver_1.UserResolver, admin_resolver_1.AdminResolver, order_resolver_1.OrderResolver];
var AppModule = /** @class */ (function () {
    function AppModule(adminService) {
        this.adminService = adminService;
        this.refreshMethods();
    }
    AppModule.prototype.refreshMethods = function () {
        for (var _i = 0, MyProviders_1 = MyProviders; _i < MyProviders_1.length; _i++) {
            var clsname = MyProviders_1[_i];
            this.adminService.getMethods(clsname);
        }
    };
    AppModule = __decorate([
        common_1.Module({
            imports: [
                jwt_1.JwtModule.register({
                    secret: "topSecret",
                    signOptions: {
                        expiresIn: 3600
                    }
                }),
                passport_1.PassportModule.register({
                    defaultStrategy: 'jwt'
                }),
                graphql_1.GraphQLFederationModule.forRoot({
                    cors: {
                        origin: '*',
                        credentials: true
                    },
                    autoSchemaFile: path_1.join(process.cwd(), "src/schema.gql"),
                    context: function (_a) {
                        var req = _a.req;
                        return ({ req: req });
                    },
                    buildSchemaOptions: {
                        orphanedTypes: [user_entity_1.User]
                    }
                })
                // GraphQLModule.forRoot({
                //   cors: {
                //     origin: '*',
                //     credentials: true,
                //   },
                //   autoSchemaFile: join(process.cwd(), "src/schema.gql"),
                //   context: ({ req }) => ({ req })
                // })
            ],
            controllers: [],
            providers: MyProviders
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
