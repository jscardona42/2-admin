import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';
import { PrismaService } from './prisma.service';
import { RolesResolver } from './modules/GestionFuncionalidades/Roles/roles.resolver';
import { RolesService } from './modules/GestionFuncionalidades/Roles/roles.service';
import { DoblesFactoresService } from './modules/DoblesFactores/doblesfactores.service';
import { DoblesFactoresResolver } from './modules/DoblesFactores/doblesfactores.resolver';
import { PermisosService } from './modules/GestionFuncionalidades/Permisos/permisos.service';
import { PermisosResolver } from './modules/GestionFuncionalidades/Permisos/permisos.resolver';
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
import { FuncionalidadesService } from './modules/GestionFuncionalidades/Funcionalidades/funcionalidades.service';
import { FuncionalidadesResolver } from './modules/GestionFuncionalidades/Funcionalidades/funcionalidades.resolver';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';


const MyProviders = [PrismaService, MenusService, MenusResolver, DoblesFactoresService, DoblesFactoresResolver, RolesService, RolesResolver, EntidadesService, EntidadesResolver, PermisosResolver, PermisosService, UsuariosService, UsuariosResolver, TraduccionesService, TraduccionesResolver, ValidacionesService, IconosService, IconosResolver, ProveedoresServiciosService, MicroserviciosService, MicroserviciosResolver, FuncionalidadesService, FuncionalidadesResolver]

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
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
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
      var myProvidersTmp = providersTmp.filter(
        (method) => !method.nameClass.includes('Service') && !method.nameClass.includes('Controller') && !method.nameClass.includes('Extend'),
      );
      // Eliminamos arreglos vacíos
      if (myProvidersTmp.length > 0) {
        myProviders[cont] = myProvidersTmp;
        cont++;
      }
    }

    var microservicio = "admin";
    var modelData = ModelData();
    // Envíamos arreglo de Resolver con sus métodos, el microservicio_id y las entidadades que no poseen resolver
    await this.proveedoresServiciosService.saveProveedoresServicios(myProviders, microservicio, modelData);
  }
}



export function ModelData() {
  let entidades = [];
  let fields = [];
  let modelData = [];
  let entidadesSec = [];
  let cont = 0;
  let EntidadesSecundariasCamposSec = [];
  let prismaModels = Prisma.dmmf.datamodel.models;

  //Recorremos las entidades
  prismaModels.forEach((model, i) => {
    cont = cont + 1;
    entidades.push(model.name);
    let field_name = "";
    let field_type = "";
    //Recorremos los campos
    model.fields.forEach(field => {
      if ((field.kind !== "object" && field.name !== "fecha_creacion" && field.name !== "fecha_actualizacion") || field.name.endsWith("Sec")) {
        if (field.name.includes("Secundaria")) {
          field_name = field.type;
          if (field.name.endsWith("Sec")) {
            field_type = "Grid"
          } else {
            field_type = field.type
          }
        } else {
          if (field.name.endsWith("Sec")) {
            field_type = "Grid"
          } else {
            field_type = field.type
          }
          field_name = field.name.replace("Sec", "")
        }
        fields.push({
          nombre: field_name,
          tipo: field_type
        });
      }

      if (field.name.endsWith("Sec")) {
        let mdfield_type = "";
        prismaModels.forEach((md) => {
          if (md.name === field.type) {
            md.fields.forEach(mdfield => {
              if (mdfield.kind !== "object" && mdfield.name !== "fecha_creacion" && mdfield.name !== "fecha_actualizacion" || mdfield.name.endsWith("Sec")) {
                if (mdfield.name.endsWith("Sec")) {
                  mdfield_type = "Grid"
                } else {
                  mdfield_type = mdfield.type
                }
                EntidadesSecundariasCamposSec.push({
                  nombre: mdfield.name,
                  tipo: mdfield_type,
                });
              }
            });
          }
        })
        if (field.name.includes("Secundaria")) {
          field_name = field.type;
        } else {
          field_name = field.name.replace("Sec", "")
        }
        entidadesSec.push({
          nombre: field_name,
          EntidadesSecundariasCamposSec: {
            create: EntidadesSecundariasCamposSec
          }
        });
      }
      EntidadesSecundariasCamposSec = []
    });
    modelData.push({
      name: entidades[cont - 1],
      fields: {
        create: fields
      },
      entidadesSec: {
        create: entidadesSec
      }
    });
    fields = [];
    entidadesSec = [];
  });

  return modelData;
}