import { Module } from '@nestjs/common';
import { GraphQLFederationModule, GraphQLGatewayModule, GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';
import { AdminResolver } from './admin/admin.resolver';
import { AdminService } from './admin/admin.service';
import { OrderResolver } from './orders/order.resolver';
import { PrismaService } from './prisma.service';
import { User } from './users/user.entity';
import { UserResolver } from './users/user.resolver';
import { UserService } from './users/user.service';

const MyProviders = [PrismaService, AdminService, UserService, UserResolver, AdminResolver, OrderResolver]

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
      context: ({ req }) => ({ req }),
      buildSchemaOptions: {
        orphanedTypes: [User],
      },
      // typePaths: ['./**/*.graphql'],
      // definitions: {
      //   path: join(process.cwd(), 'src/graphql.schema.ts'),
      // },
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
  providers: MyProviders,
})
export class AppModule {
  constructor(private readonly adminService: AdminService) {
    this.refreshMethods();
  }
  public refreshMethods() {
    for (const clsname of MyProviders) {
      this.adminService.getMethods(clsname);
    }
  }
}
