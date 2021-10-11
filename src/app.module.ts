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
import { MenusService } from './Menus/menus.service';
import { MenusResolver } from './Menus/menus.resolver';
import { UsuariosService } from './Usuarios/usuarios.service';
import { UsuariosResolver } from './Usuarios/usuarios.resolver';
import { MenusPalabrasService } from './MenusPalabras/menuspalabras.service';
import { MenusPalabrasResolver } from './MenusPalabras/menuspalabras.resolver';
import { TraduccionesService } from './Traducciones/traducciones.service';
import { TraduccionesResolver } from './Traducciones/traducciones.resolver';
import { MenusTraduccionesService } from './MenusTraducciones/menustraducciones.service';
import { MenusTraduccionesResolver } from './MenusTraducciones/menustraducciones.resolver';
import { ValidacionesService } from './Admin/Validaciones/validaciones.service';
import { ValidacionesResolver } from './Admin/Validaciones/validaciones.resolver';
import { IconosService } from './Admin/Iconos/iconos.service';
import { IconosResolver } from './Admin/Iconos/iconos.resolver';
import { ProveedoresServiciosService } from './Admin/ProveedoresServicios/proveedoresservicios.service';
import { ProveedoresServiciosController } from './Admin/ProveedoresServicios/proveedoresServicios.controller';
import { EntidadesResolver } from './Admin/Entidades/entidades.resolver';
import { MicroserviciosService } from './Admin/Microservicios/microservicios.service';
import { MicroserviciosResolver } from './Admin/Microservicios/microservicios.resolver';
import { ProveedoresServiciosResolver } from './Admin/ProveedoresServicios/proveedoresservicios.resolver';
import { MetodosValidacionService } from './Admin/MetodosValidacion/metodosvalidacion.service';
import { MetodosValidacionResolver } from './Admin/MetodosValidacion/metodosvalidacion.resolver';
import { Prisma } from '@prisma/client';

const MyProviders = [PrismaService, LoginService, LoginResolver, MenusService, MenusResolver, DoblesFactoresService, DoblesFactoresResolver, AuditoriasService, AuditoriasResolver, RolesService, RolesResolver, RolesPermisosService, RolesPermisosResolver, EntidadesService, EntidadesResolver, PermisosResolver, PermisosService, UsuariosService, UsuariosResolver, MenusPalabrasService, MenusPalabrasResolver, TraduccionesService, TraduccionesResolver, MenusTraduccionesService, MenusTraduccionesResolver, ValidacionesService, ValidacionesResolver, IconosService, IconosResolver, ProveedoresServiciosService, ProveedoresServiciosResolver, MicroserviciosService, MicroserviciosResolver, MetodosValidacionService, MetodosValidacionResolver]

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
    })
  ],
  controllers: [ProveedoresServiciosController],
  providers: MyProviders,
  exports: [MailerModule]
})

export class AppModule {
  constructor(private readonly proveedoresServiciosService: ProveedoresServiciosService) {
    this.refreshProviders();
  }

  // Esta función se encarga de crear o actualizar el listado de providers en la BD
  public async refreshProviders() {
    let cont = 0;
    var myProviders = [];

    // Recorremos el arreglo de proveedores
    for (const clsname of MyProviders) {

      // Eliminamos los métodos constructores
      var TMPmethods = Object.getOwnPropertyNames(clsname.prototype).filter(item => item !== 'constructor')

      // Damos una estructura de clase y métodos
      var providersTmp = [{ nameClass: clsname.name, methods: TMPmethods }];

      // Eliminamos Servicios y mantenemos Resolver
      var myProvidersTmp = providersTmp.filter((method) => !method.nameClass.includes('Service'));
      // Eliminamos arreglos vacíos
      if (myProvidersTmp.length > 0) {
        myProviders[cont] = myProvidersTmp;
        cont++;
      }
    }

    var microservicio_id = 1;
    var secondaryEntities = getSecondaryEntities();
    // Envíamos arreglo de Resolver con sus métodos, el microservicio_id y las entidadades que no poseen resolver
    await this.proveedoresServiciosService.saveProveedoresServicios(myProviders, microservicio_id, secondaryEntities);
  }
}

export function getSecondaryEntities() {
  var data = [];
  var cont = 0;

  Prisma.dmmf.datamodel.models.forEach((model) => {
    model.fields.forEach(field => {
      if (field.name.endsWith('Sec')) {
        data[cont] = field.name;
        cont++;
      }
    });
  });
  return data;
}
