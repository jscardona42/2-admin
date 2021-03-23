import { Module } from '@nestjs/common';
import { GraphQLFederationModule, GraphQLGatewayModule, GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';
import { AdminController } from './admin/admin.controller';
import { AdminResolver } from './admin/admin.resolver';
import { AdminService } from './admin/admin.service';
import { PrismaService } from './prisma.service';
import { User } from './users/user.entity';
import { UserResolver } from './users/user.resolver';
import { UserService } from './users/user.service';

const MyProviders = [PrismaService, AdminService, UserService, UserResolver, AdminResolver]

@Module({
  imports: [
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
        orphanedTypes: [User],
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
