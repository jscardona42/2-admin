import { Module } from '@nestjs/common';
import { GraphQLFederationModule, GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';
import { PrismaService } from './prisma.service';

import { AuditoriasService } from './Auditorias/auditorias.service';
import { AuditoriasResolver } from './Auditorias/auditorias.resolver';
import { LoginService } from './Login/login.service';
import { LoginResolver } from './Login/login.resolver';
import { RolesPermisosService } from './Admin/RolesPermisos/rolespermisos.service';
import { RolesResolver } from './Admin/Roles/roles.resolver';
import { RolesService } from './Admin/Roles/roles.service';
import { DoblesFactoresService } from './DoblesFactores/doblesfactores.service';
import { DoblesFactoresResolver } from './DoblesFactores/doblesfactores.resolver';
import { RolesPermisosResolver } from './Admin/RolesPermisos/rolespermisos.resolver';
import { PermisosService } from './Admin/Permisos/permisos.service';
import { PermisosResolver } from './Admin/Permisos/permisos.resolver';
import { EntidadesService } from './Admin/Entidades/entidades.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { PermisosController } from './Admin/Permisos/permisos.controller';
import { MenusService } from './Menus/menus.service';
import { MenusResolver } from './Menus/menus.resolver';
import { UsuariosService } from './Usuarios/usuarios.service';
import { UsuariosResolver } from './Usuarios/usuarios.resolver';
import { EmpresasMenusService } from './EmpresasMenus/empresasmenus.service';
import { EmpresasMenusResolver } from './EmpresasMenus/empresasmenus.resolver';

const MyProviders = [PrismaService, LoginService, LoginResolver, MenusService, MenusResolver, DoblesFactoresService, DoblesFactoresResolver, AuditoriasService, AuditoriasResolver, RolesService, RolesResolver, RolesPermisosService, RolesPermisosResolver, EntidadesService, PermisosResolver, PermisosService, UsuariosService, UsuariosResolver, EmpresasMenusService, EmpresasMenusResolver]

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
      // buildSchemaOptions: {
      //   orphanedTypes: [Login],
      // },
    })
  ],
  controllers: [PermisosController],
  providers: MyProviders,
  exports: [MailerModule]
})

export class AppModule {
  constructor(private readonly permisosService: PermisosService) {
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
        this.permisosService.getMethods(nameMethods);
      }
    }
  }
}
