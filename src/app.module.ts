import { Module } from '@nestjs/common';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';
import { PrismaService } from './prisma.service';
import { AuditoriasService } from './modules/Auditorias/auditorias.service';
import { AuditoriasResolver } from './modules/Auditorias/auditorias.resolver';
import { LoginService } from './modules/Login/login.service';
import { LoginResolver } from './modules/Login/login.resolver';
import { RolesResolver } from './modules/Admin/Roles/roles.resolver';
import { RolesService } from './modules/Admin/Roles/roles.service';
import { DoblesFactoresService } from './modules/DoblesFactores/doblesfactores.service';
import { DoblesFactoresResolver } from './modules/DoblesFactores/doblesfactores.resolver';
import { PermisosService } from './modules/Admin/Permisos/permisos.service';
import { PermisosResolver } from './modules/Admin/Permisos/permisos.resolver';
import { EntidadesService } from './modules/Admin/Entidades/entidades.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { MenusService } from './modules/GestionMenus/Menus/menus.service';
import { MenusResolver } from './modules/GestionMenus/Menus/menus.resolver';
import { UsuariosService } from './modules/Usuarios/usuarios.service';
import { UsuariosResolver } from './modules/Usuarios/usuarios.resolver';
import { TraduccionesService } from './modules/Traducciones/traducciones.service';
import { TraduccionesResolver } from './modules/Traducciones/traducciones.resolver';
import { ValidacionesService } from './modules/Admin/Validaciones/validaciones.service';
import { IconosService } from './modules/Admin/Iconos/iconos.service';
import { IconosResolver } from './modules/Admin/Iconos/iconos.resolver';
import { ProveedoresServiciosService } from './modules/Admin/ProveedoresServicios/proveedoresservicios.service';
import { ProveedoresServiciosController } from './modules/Admin/ProveedoresServicios/proveedoresservicios.controller';
import { EntidadesResolver } from './modules/Admin/Entidades/entidades.resolver';
import { MicroserviciosService } from './modules/Admin/Microservicios/microservicios.service';
import { MicroserviciosResolver } from './modules/Admin/Microservicios/microservicios.resolver';
import { Prisma } from '@prisma/client';

const MyProviders = [PrismaService, LoginService, LoginResolver, MenusService, MenusResolver, DoblesFactoresService, DoblesFactoresResolver, AuditoriasService, AuditoriasResolver, RolesService, RolesResolver, EntidadesService, EntidadesResolver, PermisosResolver, PermisosService, UsuariosService, UsuariosResolver, TraduccionesService, TraduccionesResolver, ValidacionesService, IconosService, IconosResolver, ProveedoresServiciosService, MicroserviciosService, MicroserviciosResolver]

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
