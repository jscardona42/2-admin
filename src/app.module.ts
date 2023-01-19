import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { join } from 'path';
import { PrismaService } from './prisma.service';
import { UsuariosService } from './modules/Usuarios/usuarios.service';
import { UsuariosResolver } from './modules/Usuarios/usuarios.resolver';
import { Prisma } from '@prisma/client';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { TbTipoUsuariosResolver } from './modules/Usuarios/TipoUsuarios/tipousuarios.resolver';
import { TbTipoUsuariosService } from './modules/Usuarios/TipoUsuarios/tipousuarios.service';
import { TbEstadosUsuariosService } from './modules/Usuarios/EstadosUsuarios/estadosusuarios.service';
import { TbEstadosUsuariosResolver } from './modules/Usuarios/EstadosUsuarios/estadosusuarios.resolver';
import { TbMetodosAutenticacionService } from './modules/MetodosAutenticacion/metodosautenticacion.service';
import { TbMetodosAutenticacionResolver } from './modules/MetodosAutenticacion/metodosautenticacion.resolver';
import * as CryptoJS from 'crypto-js';
import * as jwt from 'jsonwebtoken';
import { gql, GraphQLClient } from 'graphql-request';
import { FormulariosGestion } from './modules/Referencias/FormulariosGestion/entities/formulariosgestion.entity';
import { FormulariosEmpresasService } from './modules/FormulariosEmpresas/formulariosempresas.service';
import { FormulariosEmpresasResolver } from './modules/FormulariosEmpresas/formulariosempresas.resolver';
import { FormulariosGestionResolver } from './modules/Referencias/FormulariosGestion/formulariosgestion.resolver';
import { Funcionalidades } from './modules/Referencias/Funcionalidades/entities/funcionalidades.entity';
import { FuncionalidadesPerfilesService } from './modules/FuncionalidadesPerfiles/funcionalidadesperfiles.service';
import { FuncionalidadesPerfilesResolver } from './modules/FuncionalidadesPerfiles/funcionalidadesperfiles.resolver';
import { FuncionalidadesResolver } from './modules/Referencias/Funcionalidades/funcionalidades.resolver';
import { PerfilesService } from './modules/Perfiles/perfiles.service';
import { PerfilesResolver } from './modules/Perfiles/perfiles.resolver';
import { UsuariosParametrosService } from './modules/UsuariosParametros/usuariosparametros.service';
import { UsuariosParametrosResolver } from './modules/UsuariosParametros/usuariosparametros.resolver';
import { UsuariosSesionesService } from './modules/UsuariosSesiones/usuariossesiones.service';
import { UsuariosSesionesResolver } from './modules/UsuariosSesiones/usuariossesiones.resolver';
import { UsuariosHistoricoContrasenasService } from './modules/UsuariosHistoricoContrasenas/usuarioshistoricocontrasenas.service';
import { UsuariosHistoricoContrasenasResolver } from './modules/UsuariosHistoricoContrasenas/usuarioshistoricocontrasenas.resolver';

const MyProviders = [PrismaService, TbEstadosUsuariosService, TbEstadosUsuariosResolver, TbTipoUsuariosResolver, TbTipoUsuariosService, UsuariosService, UsuariosResolver, TbMetodosAutenticacionService, TbMetodosAutenticacionResolver, FormulariosEmpresasService, FormulariosEmpresasResolver, FormulariosGestionResolver, FuncionalidadesPerfilesService, FuncionalidadesPerfilesResolver, FuncionalidadesResolver, PerfilesService, PerfilesResolver, UsuariosParametrosService, UsuariosParametrosResolver, UsuariosSesionesService, UsuariosSesionesResolver, UsuariosHistoricoContrasenasService, UsuariosHistoricoContrasenasResolver, UsuariosSesionesResolver, UsuariosSesionesService ]

@Module({
  imports: [
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
      buildSchemaOptions: {
        orphanedTypes: [FormulariosGestion, Funcionalidades],
      },

    })
  ],
  controllers: [],
  providers: MyProviders,
  exports: []
})

export class AppModule {
  constructor() {
    getResolutoresAndModeloDatos();
  }
}

export async function getResolutoresAndModeloDatos() {
  let cont = 0;
  let resolutores = [];
  for (const clsname of MyProviders) {

    let TMPmethods =
      Object.getOwnPropertyNames(clsname.prototype).filter(
        item => item !== 'constructor'
      )
    let providersTmp = [{ nameClass: clsname.name, methods: TMPmethods }];
    let myProvidersTmp = providersTmp.filter(
      (method) => !method.nameClass.includes('Service') && !method.nameClass.includes('Controller') && !method.nameClass.includes('Extend'),
    );
    if (myProvidersTmp.length > 0) {
      resolutores[cont] = myProvidersTmp;
      cont++;
    }
  }
  let modeloDatos = getModeloDatos();

  await setDataMicroserviciosEstructura("admin", modeloDatos, resolutores)
}

export function getModeloDatos() {
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
          } else if (field.isId) {
            field_type = "Serial"
          } else if (field.isReadOnly) {
            field_type = "List"
          } else {
            field_type = field.type
          }
        } else {
          if (field.name.endsWith("Sec")) {
            field_type = "Grid"
          } else if (field.type === "String") {
            if (field.default == "") {
              field_type = "Text"
            } else {
              field_type = "String"
            }
          } else if (field.isId) {
            field_type = "Serial"
          } else if (field.isReadOnly) {
            field_type = "List"
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
                } else if (mdfield.type === "String") {
                  if (mdfield.default == "") {
                    mdfield_type = "Text"
                  } else {
                    mdfield_type = "String"
                  }
                } else if (mdfield.isId) {
                  mdfield_type = "Serial"
                } else if (mdfield.isReadOnly) {
                  mdfield_type = "List"
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
          EntidadesSecundariasCamposSec
        });
      }
      EntidadesSecundariasCamposSec = []
    });
    modelData.push({
      name: entidades[cont - 1],
      fields,
      entidadesSec
    });
    fields = [];
    entidadesSec = [];
  });

  return modelData;
}

export async function setDataMicroserviciosEstructura(microservicio: string, modelo_datos: any, resolutores: any) {
  let entidades: any;

  let referer = jwt.sign(process.env.JWT_URL, process.env.JWT_SECRET_URL);
  referer = CryptoJS.AES.encrypt(referer, process.env.KEY_CRYPTO_ADMIN).toString();

  const client = new GraphQLClient(process.env.ADMIN_GENERAL_URL + "/graphql")
  const queryValidation = gql`
                mutation createMicroservicioEstructura($microservicio:String!, $modelo_datos: String!,$resolutores:String!) {
                    createMicroservicioEstructura(microservicio: $microservicio,modelo_datos: $modelo_datos, resolutores: $resolutores) {
                      microservicio_estructura_id
                    }
                }
                `
  const variables = {
    microservicio: microservicio,
    modelo_datos: JSON.stringify(modelo_datos),
    resolutores: JSON.stringify(resolutores)
  }
  const requestHeaders = {
    authorization_url: referer
  }

  try {
    entidades = await client.request(queryValidation, variables, requestHeaders);
  } catch (error) {
    if (error.errno !== undefined) {
      console.log("El microservicio del admin general no es accesible en este momento");
    } else {
      console.log(error.response.errors);
    }
  }
  return entidades;
}