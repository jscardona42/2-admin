import { Module } from '@nestjs/common';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';
import { AdminController } from './admin/admin.controller';
import { AdminResolver } from './admin/admin.resolver';
import { AdminService } from './admin/admin.service';
import { MenuResolver } from './menu/menu.resolver';
import { MenuService } from './menu/menu.service';
import { PrismaService } from './prisma.service';
import { TwofactorResolver } from './twofactor/twofactor.resolver';
import { TwofactorService } from './twofactor/twofactor.service';
import { Login } from './users/login.entity';
import { LoginResolver } from './users/login.resolver';
import { LoginService } from './users/login.service';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { AuditService } from './audit/audit.service';
import { AuditResolver } from './audit/audit.resolver';

const MyProviders = [PrismaService, AdminService, LoginService, LoginResolver, AdminResolver, MenuService, MenuResolver, TwofactorService, TwofactorResolver, AuditService, AuditService, AuditResolver]

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
  controllers: [AdminController],
  providers: MyProviders,
  exports: [MailerModule]
})

export class AppModule {
  constructor(private readonly adminService: AdminService) {
    this.refreshMethods();
  }
  public refreshMethods() {
    for (const clsname of MyProviders) {
      var TMPmethods = Object.getOwnPropertyNames(clsname.prototype).filter(
        item => item !== 'constructor'
      );
      this.adminService.getMethods(TMPmethods, clsname.name);
    }
  }
}
