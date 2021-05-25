import { Module } from '@nestjs/common';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';
import { MenuResolver } from './Menu/menu.resolver';
import { MenuService } from './Menu/menu.service';
import { PrismaService } from './prisma.service';
import { TwofactorResolver } from './Twofactor/twofactor.resolver';
import { TwofactorService } from './Twofactor/twofactor.service';
import { Login } from './Users/login.entity';
import { LoginResolver } from './Users/login.resolver';
import { LoginService } from './Users/login.service';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { AuditService } from './Audit/audit.service';
import { AuditResolver } from './Audit/audit.resolver';
import { RoleService } from './Admin/Role/role.service';
import { RoleResolver } from './Admin/Role/role.resolver';
import { RolePermissionService } from './Admin/RolePermission/rolepermission.service';
import { RolePermissionResolver } from './Admin/RolePermission/rolepermission.resolver';
import { PermissionService } from './Admin/Permission/permission.service';
import { PermissionController } from './Admin/Permission/permission.controller';
import { PermissionPrincipalService } from './Admin/PermissionPrincipal/permissionprincipal.service';
import { PermissionResolver } from './Admin/Permission/permission.resolver';

const MyProviders = [PrismaService, LoginService, LoginResolver, MenuService, MenuResolver, TwofactorService, TwofactorResolver, AuditService, AuditService, AuditResolver, RoleService, RoleResolver, RolePermissionService, RolePermissionResolver,PermissionService, RolePermissionResolver, PermissionPrincipalService, PermissionResolver, PermissionService]

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.HOST_MAILER,
        port: process.env.PORT_MAILER,
        auth: {
          user: process.env.USER_MAILER,
          pass: process.env.PASSWORD_MAILER
        },
      }
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRESIN
      }
    }),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    GraphQLFederationModule.forRoot({
      cors: {
        origin: '*',
        credentials: true,
      },
      context: ({ req, res }) => ({
        req: req,
        res: res
      }),
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      buildSchemaOptions: {
        orphanedTypes: [Login],
      },
    })
  ],
  controllers: [PermissionController],
  providers: MyProviders,
  exports: [MailerModule]
})

export class AppModule {
  constructor(private readonly permissionService: PermissionService) {
    this.refreshMethods();
  }
  public refreshMethods() {
    for (const clsname of MyProviders) {
      var TMPmethods =
        Object.getOwnPropertyNames(clsname.prototype).filter(
          item => item !== 'constructor'
        )

      var nameMethodsTmp = [{ nameClass: clsname.name, methods: TMPmethods }];
      var nameMethods = nameMethodsTmp.filter(
        (method) => !method.nameClass.includes('Service'),
      );

      if (nameMethods.length > 0) {
        this.permissionService.getMethods(nameMethods);
      }
    }
  }
}
