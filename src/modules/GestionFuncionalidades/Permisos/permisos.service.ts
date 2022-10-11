import { Injectable, UnauthorizedException } from '@nestjs/common';
import { prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma.service';
import { EntidadesService } from '../../Admin/Entidades/entidades.service';
import { ValidacionesService } from '../../Admin/Validaciones/validaciones.service';
import { UpdatePermisoInput } from './dto/permisos.dto';
import { Permisos } from './entities/permisos.entity';

@Injectable()
export class PermisosService {
  constructor(
    private prismaService: PrismaService,
    private entidadesService: EntidadesService,
    private validacionesService: ValidacionesService,
  ) { }

  async getPermisos(): Promise<any[]> {
    return this.prismaService.permisos.findMany({
      include: { Entidades: true, PermisosValidacionesSec: { include: { ValidacionesSec: true, Permisos: true } } }
    });
  }

  async getPermisoById(permiso_id: number): Promise<any> {
    var permisos = await this.prismaService.permisos.findUnique({
      where: { permiso_id: permiso_id },
      include: { Entidades: true, PermisosValidacionesSec: { include: { ValidacionesSec: true, Permisos: true } } }
    });

    if (permisos === null) {
      throw new UnauthorizedException(`El permiso con id ${permiso_id} no existe`);
    }

    return permisos;
  }

  async getFilterPermisos(permiso: string): Promise<any[]> {
    return this.prismaService.permisos.findMany({
      where: { OR: [{ permiso: { contains: permiso, mode: "insensitive" } }] },
      include: { Entidades: true, PermisosValidacionesSec: { include: { ValidacionesSec: true, Permisos: true } } }
    });
  }

  async preparePermisos() {
    let providers = await this.prismaService.proveedoresServicios.findMany();
    providers.forEach(provider => {
      JSON.parse(provider.lista_proveedores).forEach(lista => {
        return this.saveEntidadesPermisosValidaciones(lista, provider.microservicio_id);
      });
    });
  }
  // Esta función se encarga de almacenar Entidades y Permisos
  async saveEntidadesPermisosValidaciones(nameMethods, microservicio_id) {
    let upsertEntidades = [];
    let upsertPermisos = [];
    let createPermisos = [];

    await nameMethods.reduce(async (promise, entidad) => {
      await promise;
      let entidad_id = 0;

      let ent = await this.prismaService.entidades.findFirst({
        where: { nombre: entidad.nameClass.replace("Resolver", "") }
      });

      if (ent !== null) {
        entidad_id = ent.entidad_id;
      }

      await entidad.methods.reduce(async (promise2, permiso) => {
        await promise2;

        let is_public = false;
        let per = await this.prismaService.permisos.findFirst({
          where: { permiso: permiso, entidad_id: entidad_id }
        });

        if (permiso.startsWith("ex")) {
          is_public = true;
        }
        if (!permiso.includes("Referencia")) {
          if (per === null) {
            createPermisos.push({
              permiso: permiso,
              es_publico: is_public
            });
          } else {
            upsertPermisos.push({
              where: { permiso_id: per.permiso_id },
              create: {
                permiso: permiso,
                es_publico: is_public
              },
              update: {
                es_publico: is_public,
                permiso: permiso
              }
            });
          }
        }
      }, Promise.resolve());

      upsertEntidades.unshift(this.prismaService.entidades.upsert({
        where: { entidad_id: entidad_id },
        create: {
          nombre: entidad.nameClass.replace("Resolver", ""),
          resolver: entidad.nameClass,
          microservicio_id: microservicio_id,
          Permisos: {
            create: createPermisos
          }
        },
        update: {
          nombre: entidad.nameClass.replace("Resolver", ""),
          resolver: entidad.nameClass,
          microservicio_id: microservicio_id,
          Permisos: {
            upsert: upsertPermisos
          },
        }
      }));

      upsertPermisos = [];
      createPermisos = [];

    }, Promise.resolve());

    await this.prismaService.$transaction(upsertEntidades);

    return true;
  }

  // Esta función permite almacenar en BD el nombre los métodos por cada resolver
  async createPermisos(cls): Promise<any> {
    var entidad = await this.prismaService.entidades.findFirst({
      where: { resolver: cls.name },
      select: { entidad_id: true }
    })

    var permiso = await this.prismaService.permisos.findFirst({
      where: { permiso: cls.permiso }
    })

    // Validamos si el permiso ya existe
    if (entidad !== null && permiso === null) {
      return this.prismaService.permisos.create({
        data: { entidad_id: entidad.entidad_id, permiso: cls.permiso, es_publico: cls.is_public },
        include: { Entidades: true, PermisosValidacionesSec: { include: { ValidacionesSec: true, Permisos: true } } }
      });
    } else {
      return this.prismaService.permisos.update({
        where: { permiso_id: permiso.permiso_id },
        data: { entidad_id: entidad.entidad_id, permiso: cls.permiso, es_publico: cls.is_public },
        include: { Entidades: true, PermisosValidacionesSec: { include: { ValidacionesSec: true, Permisos: true } } }
      });
    }
  }

  async updatePermiso(data: UpdatePermisoInput): Promise<any> {

    await this.getPermisoById(data.permiso_id);
    await this.entidadesService.getEntidadeById(data.entidad_id);

    return this.prismaService.permisos.update({
      where: { permiso_id: data.permiso_id },
      data: {
        entidad_id: data.entidad_id,
        es_publico: data.es_publico,
        permiso: data.permiso
      },
      include: { Entidades: true, PermisosValidacionesSec: { include: { ValidacionesSec: true, Permisos: true } } }
    })
  }

  async deletePermiso(permiso_id: number): Promise<any> {

    await this.getPermisoById(permiso_id);

    return this.prismaService.permisos.delete({
      where: { permiso_id: permiso_id },
      include: { Entidades: true, PermisosValidacionesSec: { include: { ValidacionesSec: true, Permisos: true } } }
    });
  }
}
