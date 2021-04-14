import { Module } from '@nestjs/common';
import { GraphQLFederationModule, GraphQLGatewayModule, GraphQLModule } from '@nestjs/graphql';
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
import { TwoFactorAuthenticationService } from './twofactor/twoFactorAuthentication.service';
import { Login } from './users/login.entity';
import { LoginResolver } from './users/login.resolver';
import { LoginService } from './users/login.service';
import { MailerModule } from '@nestjs-modules/mailer';

const MyProviders = [PrismaService, AdminService, LoginService, LoginResolver, AdminResolver, MenuService, MenuResolver, TwoFactorAuthenticationService, TwofactorService, TwofactorResolver]

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: "tiresiatest@gmail.com",
          pass: "Tiresia2021*"
        },
      }
    }),
    JwtModule.register({
      secret: "topSecret",
      signOptions: {
        expiresIn: 3600
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
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      buildSchemaOptions: {
        orphanedTypes: [Login],
      },
    })
  ],
  controllers: [AdminController],
  providers: MyProviders,
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
