import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { EntidadesService } from '../Entidades/entidades.service';
import { ValidacionesService } from '../Validaciones/validaciones.service';
import { Permisos } from './entities/permisos.entity';

@Injectable()
export class PermisosService {
  constructor(private prismaService: PrismaService, private entidadesService: EntidadesService, private validacionesService: ValidacionesService) { }

  async getPermisos(): Promise<any[]> {
    return await this.prismaService.permisos.findMany();
  }

  getMethods(nameMethods) {
    var dataPermisos: any = [];
    var dataResolvers = [];
    var dataValidaciones = [];
    var is_public = false;

    try {
      nameMethods.forEach(function (nameClass, i) {
        dataResolvers[i] = { name: nameClass.nameClass, permiso: nameClass.nameClass, is_public: is_public };
        nameClass.methods.forEach(function (nameMethod, j) {
          if (nameMethod.includes("Referencia")) {
            dataValidaciones[j] = { id_referenciado: nameMethod, resolver: nameClass }
          }
          if (nameMethod.startsWith("ex")) {
            is_public = true;
          }
          dataPermisos[j] = { name: nameClass.nameClass, permiso: nameMethod, is_public: is_public };
        });
      });

      dataValidaciones.forEach(validacion => {
        this.validacionesService.createValidacion(validacion);
      });

      dataResolvers.forEach(permission => {
        this.entidadesService.createEntidad(permission);
      });

      setTimeout(() => {
        dataResolvers.concat(dataPermisos).forEach(permission => {
          this.createPermisos(permission);
        });
      }, 1500);

    } catch (error) {
      return JSON.stringify({ status: 400 });
    }

    return JSON.stringify({ status: 200 });
  }

  async getPermisoById(permiso_id: number): Promise<Permisos> {
    var permisos = await this.prismaService.permisos.findUnique({
      where: { permiso_id: permiso_id },
      include: { Entidades: true }
    });

    if (permisos === null) {
      throw new UnauthorizedException(`El permiso con id ${permiso_id} no existe`);
    }

    return permisos;
  }

  async getFilterPermisos(permiso: string): Promise<Permisos[]> {
    return await this.prismaService.permisos.findMany({
      where: { OR: [{ permiso: { contains: permiso, mode: "insensitive" } }] },
      include: { Entidades: true }
    });
  }

  async createPermisos(cls): Promise<Permisos> {
    var entidad = await this.prismaService.entidades.findFirst({
      where: { resolver: cls.name },
      select: { entidad_id: true }
    })

    var permiso = await this.prismaService.permisos.findFirst({
      where: { permiso: cls.permiso }
    })

    if (entidad !== null && permiso === null) {
      return this.prismaService.permisos.create({
        data: { entidad_id: entidad.entidad_id, permiso: cls.permiso, es_publico: cls.is_public },
        include: { Entidades: true }
      });
    } else {
      return this.prismaService.permisos.update({
        where: { permiso_id: permiso.permiso_id },
        data: { entidad_id: entidad.entidad_id, permiso: cls.permiso, es_publico: cls.is_public },
        include: { Entidades: true }
      });
    }
  }
}
