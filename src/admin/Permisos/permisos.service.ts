import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { EntidadesService } from '../Entidades/entidades.service';
import { Permisos } from './entities/permisos.entity';

@Injectable()
export class PermisosService {
  constructor(private prismaService: PrismaService, private entidadesService: EntidadesService) { }

  async getPermisos(): Promise<any[]> {
    return await this.prismaService.permisos.findMany();
  }

  getMethods(nameMethods) {
    var dataPermisos: any = [];
    var dataResolvers = [];
    var is_public = false;

    try {
      nameMethods.forEach(function (nameClass, i) {
        dataResolvers[i] = { name: nameClass.nameClass, permiso: nameClass.nameClass, is_public: is_public };
        nameClass.methods.forEach(function (nameMethod, j) {
          if (nameMethod.startsWith("ex")) {
            is_public = true;
          }
          dataPermisos[j] = { name: nameClass.nameClass, permiso: nameMethod, is_public: is_public };
        });
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
      });
    } else {
      return this.prismaService.permisos.update({
        where: { permiso_id: permiso.permiso_id },
        data: { entidad_id: entidad.entidad_id, permiso: cls.permiso, es_publico: cls.is_public },
      });
    }
  }
}
