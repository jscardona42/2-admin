import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModelData } from 'src/app.module';
import { PrismaService } from '../../../prisma.service';
import { UpdateEntidadInput } from './dto/entidades.dto';
import { Entidades } from './entities/entidades.entity';

@Injectable()
export class EntidadesService {
  constructor(
    private prismaService: PrismaService
  ) { }

  async getEntidades(): Promise<any[]> {
    return this.prismaService.entidades.findMany({
      include: { EntidadesCamposSec: true, EntidadesSecundariasSec: { include: { EntidadesSecundariasCamposSec: true } }, Permisos: true }
    });
  }

  async getEntidadesForFormularios(): Promise<any[]> {
    return this.prismaService.entidades.findMany({
      include: { EntidadesCamposSec: true, EntidadesSecundariasSec: { include: { EntidadesSecundariasCamposSec: true } }, Permisos: { where: { OR: [{ permiso: { startsWith: "create" } }, { permiso: { startsWith: "update" } }] }, orderBy: { permiso: "asc" } } }
    });
  }

  async getEntidadeById(entidad_id: number): Promise<any> {
    return this.prismaService.entidades.findUnique({
      where: { entidad_id: entidad_id },
      include: { EntidadesCamposSec: true, EntidadesSecundariasSec: { include: { EntidadesSecundariasCamposSec: true } }, Permisos: true },
      rejectOnNotFound: () => new UnauthorizedException(`La entidad con id ${entidad_id} no existe`)
    });
  }

  async getEntidadForFormularios(entidad_id: number): Promise<any> {
    return this.prismaService.entidades.findUnique({
      where: { entidad_id: entidad_id },
      include: { EntidadesCamposSec: true, EntidadesSecundariasSec: { include: { EntidadesSecundariasCamposSec: true } }, Permisos: { select: { permiso: true } } },
      rejectOnNotFound: () => new UnauthorizedException(`La entidad con id ${entidad_id} no existe`)
    });
  }

  async getFilterEntidades(nombre: string): Promise<any[]> {
    return this.prismaService.entidades.findMany({
      where: { OR: [{ nombre: { contains: nombre, mode: "insensitive" } }] },
      include: { EntidadesCamposSec: true, EntidadesSecundariasSec: { include: { EntidadesSecundariasCamposSec: true } }, Permisos: true }
    })
  }

  async updateEntidad(data: UpdateEntidadInput): Promise<any> {

    await this.getEntidadeById(data.entidad_id);

    return this.prismaService.entidades.update({
      where: { entidad_id: data.entidad_id },
      data: { nombre: data.nombre, resolver: data.resolver },
      include: { EntidadesCamposSec: true, EntidadesSecundariasSec: { include: { EntidadesSecundariasCamposSec: true } }, Permisos: true }
    });
  }

  async deleteEntidad(entidad_id: number): Promise<any> {

    await this.getEntidadeById(entidad_id);

    return this.prismaService.entidades.delete({
      where: { entidad_id: entidad_id },
      include: { EntidadesCamposSec: true, EntidadesSecundariasSec: { include: { EntidadesSecundariasCamposSec: true } }, Permisos: true }
    });
  }


  // Esta función permite almacenar en BD el nombre los resolver
  async createEntidad(cls): Promise<any> {

    let entidades = await this.prismaService.entidades.findFirst({
      where: { resolver: cls.name }
    })

    // Guardamos el nombre de la entidad quitando la palabra Resolver y en otra columna el nombre del resolver
    if (entidades === null) {
      return this.prismaService.entidades.create({
        data: { resolver: cls.name, nombre: cls.name.replace("Resolver", "") },
      });
    }
    return entidades;
  }

  async prepareSecondaryEntities(tipo: string) {
    let providers = await this.prismaService.proveedoresServicios.findMany();
    providers.forEach(provider => {
      if (tipo === "add") {
        this.saveAdditionalEntidades(JSON.parse(provider.model_data));
      } else {
        this.saveEntidadesDependientes(JSON.parse(provider.model_data));
      }

    });
    return this.prismaService.entidades.findMany({
      include: { EntidadesCamposSec: true, EntidadesSecundariasSec: { include: { EntidadesSecundariasCamposSec: true } }, Permisos: true }
    });
  }

  async saveAdditionalEntidades(modelData: any[]) {
    let updateEntidadesSec = [];
    let updateEntidadesSecCampos = [];
    let createEntidadesSecCampos = [];

    let newModelData = await this.getPrimaryEntities(modelData);

    await newModelData.reduce(async (promise, model) => {
      await promise;

      await model.entidadesSec.create.reduce(async (promise2, sec) => {
        await promise2;

        let entidad_secundaria_padre_id = await this.getEntidadSecundariaByNombreAndEntidadId(sec.nombre, model.entidad_id);

        await sec.EntidadesSecundariasCamposSec.create.reduce(async (promise3, secCampo) => {
          await promise3;

          if (secCampo.tipo === "Grid") {
            await modelData.reduce(async (promise4, model2) => {
              await promise4;

              if (secCampo.nombre == model2.name + "Sec") {
                let entidad_secundaria_id = await this.getEntidadSecundariaByNombreAndEntidadId(model2.name, model.entidad_id);

                await model2.fields.create.reduce(async (promise4, field2) => {
                  await promise4;

                  let entidad_secundaria_campo_id = await this.getEntidadSecundariaCampoByNombreAndEntidadId(field2.nombre, entidad_secundaria_id);

                  if (entidad_secundaria_campo_id === 0) {
                    createEntidadesSecCampos.push(await this.buildEntidadesDependientesCampos(field2));
                  }
                  updateEntidadesSecCampos.push(await this.buildUpsertEntidadesDependientesCampos(entidad_secundaria_campo_id, field2));

                }, Promise.resolve());

                updateEntidadesSec.push(await this.buildUpsertEntidadesDependientes(entidad_secundaria_id, model2, entidad_secundaria_padre_id, updateEntidadesSecCampos, createEntidadesSecCampos));

                createEntidadesSecCampos = [];
                updateEntidadesSecCampos = [];
              }

            }, Promise.resolve());
          }

        }, Promise.resolve());
      }, Promise.resolve());

      if (updateEntidadesSec[0] != undefined) {
        await this.prismaService.entidades.update({
          where: { entidad_id: model.entidad_id },
          data: {
            EntidadesSecundariasSec: {
              upsert: updateEntidadesSec
            }
          }
        })
      }
      updateEntidadesSec = [];
    }, Promise.resolve());
  }

  async buildUpsertEntidadesDependientesCampos(entidad_secundaria_campo_id: number, field2: any,) {
    return {
      where: { entidad_secundaria_campo_id: entidad_secundaria_campo_id },
      update: {
        nombre: field2.nombre,
        tipo: field2.tipo
      },
      create: {
        nombre: field2.nombre,
        tipo: field2.tipo
      }
    };
  }

  async buildEntidadesDependientesCampos(field2: any) {
    return {
      nombre: field2.nombre,
      tipo: field2.tipo
    };
  }

  async buildUpsertEntidadesDependientes(entidad_secundaria_id: number, model2: any, entidad_secundaria_padre_id: number, updateEntidadesSecCampos: any[], createEntidadesSecCampos: any[]) {
    return {
      where: { entidad_secundaria_id: entidad_secundaria_id },
      update: {
        nombre: model2.name,
        padre_id: entidad_secundaria_padre_id,
        EntidadesSecundariasCamposSec: {
          upsert: updateEntidadesSecCampos
        }
      },
      create: {
        nombre: model2.name,
        padre_id: entidad_secundaria_padre_id,
        EntidadesSecundariasCamposSec: {
          create: createEntidadesSecCampos
        }
      }
    };
  }

  async saveEntidadesDependientes(modelData) {
    let updateEntidadesSec = [];
    let updateEntidadesSecCampos = [];
    let createEntidadesSecCampos = [];
    let updateEntidadesCampos = [];

    // Obtenemos sólo las entidades primarias
    let newModelData = await this.getPrimaryEntities(modelData);

    await newModelData.reduce(async (promise, model) => {
      await promise;

      await model.fields.create.reduce(async (promise2, field) => {
        await promise2;

        let entidad_campo_id = await this.getEntidadCampoByNombreAndEntidadId(field.nombre, model.entidad_id);

        updateEntidadesCampos.push({
          where: { entidad_campo_id: entidad_campo_id },
          update: {
            nombre: field.nombre,
            tipo: field.tipo
          },
          create: {
            nombre: field.nombre,
            tipo: field.tipo
          }
        });

      }, Promise.resolve());

      await model.entidadesSec.create.reduce(async (promise3, sec) => {
        await promise3;

        let entidad_secundaria_id = await this.getEntidadSecundariaByNombreAndEntidadId(sec.nombre, model.entidad_id);

        await sec.EntidadesSecundariasCamposSec.create.reduce(async (promise4, secCampo, j) => {
          await promise4;

          let entidad_secundaria_campo_id = await this.getEntidadSecundariaCampoByNombreAndEntidadId(secCampo.nombre, entidad_secundaria_id);

          if (entidad_secundaria_campo_id === 0) {
            createEntidadesSecCampos.push(await this.buildEntidadesDependientesCampos(secCampo));
          }
          updateEntidadesSecCampos.push(await this.buildUpsertEntidadesDependientesCampos(entidad_secundaria_campo_id, secCampo));

        }, Promise.resolve());

        updateEntidadesSec.push({
          where: { entidad_secundaria_id: entidad_secundaria_id },
          update: {
            nombre: sec.nombre,
            EntidadesSecundariasCamposSec: {
              upsert: updateEntidadesSecCampos
            }
          },
          create: {
            nombre: sec.nombre,
            EntidadesSecundariasCamposSec: {
              create: createEntidadesSecCampos
            }
          }
        });

        updateEntidadesSecCampos = [];
        createEntidadesSecCampos = [];
      }, Promise.resolve());

      await this.prismaService.entidades.update({
        where: { entidad_id: model.entidad_id },
        data: {
          EntidadesCamposSec: {
            upsert: updateEntidadesCampos
          },
          EntidadesSecundariasSec: {
            upsert: updateEntidadesSec
          }
        }
      })

      updateEntidadesCampos = [];
      updateEntidadesSec = [];
    }, Promise.resolve());
  }

  async getPrimaryEntities(modelData: any): Promise<any> {
    let cont = 0;
    let newModelData = [];

    await modelData.reduce(async (promise5, element,i) => {
      await promise5;
      let entidad = await this.prismaService.entidades.findFirst({
        where: { nombre: element.name },
        select: { entidad_id: true }
      });

      if (entidad !== null) {
        newModelData[cont] = modelData[i];
        newModelData[cont]["entidad_id"] = entidad.entidad_id;
        cont = cont + 1;
      }
    }, Promise.resolve());
    return newModelData;
  }

  async getEntidadCampoByNombreAndEntidadId(nombre: string, entidad_id: number): Promise<number> {
    let entidad_campo_id = 0;

    let entidadCampo = await this.prismaService.entidadesCampos.findFirst({
      where: { nombre: nombre, entidad_id: entidad_id },
      select: { entidad_campo_id: true },
    });

    if (entidadCampo !== null) {
      entidad_campo_id = entidadCampo.entidad_campo_id;
    }
    return entidad_campo_id
  }

  async getEntidadSecundariaByNombreAndEntidadId(nombre: string, entidad_id: number): Promise<number> {
    let entidad_secundaria_id = 0;

    let entidadSecundaria = await this.prismaService.entidadesSecundarias.findFirst({
      where: { nombre: nombre, entidad_id: entidad_id },
      select: { entidad_secundaria_id: true },
    });
    if (entidadSecundaria !== null) {
      entidad_secundaria_id = entidadSecundaria.entidad_secundaria_id;
    }
    return entidad_secundaria_id;
  }

  async getEntidadSecundariaCampoByNombreAndEntidadId(nombre: string, entidad_secundaria_id: number): Promise<any> {
    let entidad_secundaria_campo_id = 0;

    let entidadSecundariaCampo = await this.prismaService.entidadesSecundariasCampos.findFirst({
      where: { nombre: nombre, entidad_secundaria_id: entidad_secundaria_id },
      select: { entidad_secundaria_campo_id: true },
    });

    if (entidadSecundariaCampo !== null) {
      entidad_secundaria_campo_id = entidadSecundariaCampo.entidad_secundaria_campo_id;
    }
    return entidad_secundaria_campo_id;
  }
}
