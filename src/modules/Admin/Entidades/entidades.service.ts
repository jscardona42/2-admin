import { Injectable, UnauthorizedException } from '@nestjs/common';
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

    var entidades = await this.prismaService.entidades.findFirst({
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

  async prepareSecondaryEntities() {
    var providers = await this.prismaService.proveedoresServicios.findMany();
    providers.forEach(provider => {
      return this.saveSecondaryEntities(JSON.parse(provider.model_data));
    });
  }

  async saveSecondaryEntities(modelData) {
    let updateEntidadesSec = [];
    let entidad_secundaria_campo_id = 0;
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

          let entidadSecundariaCampo = await this.getEntidadSecundariaCampoByNombreAndEntidadId(secCampo.nombre, entidad_secundaria_id);

          if (entidadSecundariaCampo !== null) {
            entidad_secundaria_campo_id = entidadSecundariaCampo.entidad_secundaria_campo_id;
          } else {
            createEntidadesSecCampos.push({
              nombre: secCampo.nombre,
              tipo: secCampo.tipo
            });
            entidad_secundaria_campo_id = 0;
          }

          updateEntidadesSecCampos.push({
            where: { entidad_secundaria_campo_id: entidad_secundaria_campo_id },
            update: {
              nombre: secCampo.nombre,
              tipo: secCampo.tipo
            },
            create: {
              nombre: secCampo.nombre,
              tipo: secCampo.tipo
            }
          });

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

    await Promise.all(modelData.map(async (element, i) => {
      let entidad = await this.prismaService.entidades.findFirst({
        where: { nombre: element.name },
        select: { entidad_id: true }
      });

      if (entidad !== null) {
        newModelData[cont] = modelData[i];
        newModelData[cont]["entidad_id"] = entidad.entidad_id;
        cont = cont + 1;
      }
    }))
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
    return this.prismaService.entidadesSecundariasCampos.findFirst({
      where: { nombre: nombre, entidad_secundaria_id: entidad_secundaria_id },
      select: { entidad_secundaria_campo_id: true },
    });
  }
}
