import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { EntidadesService } from '../Entidades/entidades.service';
import { ValidacionesService } from '../Validaciones/validaciones.service';
import { UpdatePermisoInput } from './dto/permisos.dto';
import { Permisos } from './entities/permisos.entity';

@Injectable()
export class PermisosService {
  constructor(
    private prismaService: PrismaService,
    private entidadesService: EntidadesService,
    private validacionesService: ValidacionesService,
    ) { }

  async getPermisos(): Promise<Permisos[]> {
    return await this.prismaService.permisos.findMany({
      include: { Entidades: true }
    });
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

  async preparePermisos() {
    var providers = await this.prismaService.proveedoresServicios.findMany();
    providers.forEach(provider => {
      JSON.parse(provider.lista_proveedores).forEach(lista => {
        return this.saveEntidadesPermisosValidaciones(lista);
      });
    });
  }

  // Esta función se encarga de almacenar Entidades y Permisos
  saveEntidadesPermisosValidaciones(nameMethods) {
    var dataPermisos: any = [];
    var dataResolvers = [];
    var dataValidaciones = [];
    var is_public = false;

    try {
      // Recorremos el arreglo con todos los resolver y sus métodos
      nameMethods.forEach(function (nameClass, i) {
        // Almacenamos los nombres de los resolver
        dataResolvers[i] = { name: nameClass.nameClass, permiso: nameClass.nameClass, is_public: is_public };
        nameClass.methods.forEach(function (nameMethod, j) {
          if (nameMethod.includes("Referencia")) {
            // Almacenamos las validaciones
            dataValidaciones[j] = { id_referenciado: nameMethod, resolver: nameClass }
          }
          // Validamos qué métodos son públicos
          if (nameMethod.startsWith("ex")) {
            is_public = true;
          }
          // Almacenamos los nombres de los métodos separados por resolver
          dataPermisos[j] = { name: nameClass.nameClass, permiso: nameMethod, is_public: is_public };
        });
      });

      // Guardamos en BD las validaciones
      dataValidaciones.forEach(validacion => {
        this.validacionesService.createValidacion(validacion);
      });

      // Guardamos en BD las entidades
      dataResolvers.forEach(permission => {
        this.entidadesService.createEntidad(permission);
      });

      // Guardamos en BD los permisos
      setTimeout(() => {
        dataResolvers.concat(dataPermisos).forEach(permission => {
          this.createPermisos(permission);
        });
      }, 1500);

    } catch (error) {
      return JSON.stringify({ status: 400 });
    }
  }

  // Esta función permite almacenar en BD el nombre los métodos por cada resolver
  async createPermisos(cls): Promise<Permisos> {
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

  async updatePermiso(data: UpdatePermisoInput) {

    await this.getPermisoById(data.permiso_id);
    await this.entidadesService.getEntidadeById(data.entidad_id);

    return this.prismaService.permisos.update({
      where: { permiso_id: data.permiso_id },
      data: {
        entidad_id: data.entidad_id,
        es_publico: data.es_publico,
        permiso: data.permiso
      },
      include: { Entidades: true }
    })
  }

  async deletePermiso(permiso_id: number): Promise<Permisos> {

    await this.getPermisoById(permiso_id);

    return this.prismaService.permisos.delete({
      where: { permiso_id: permiso_id },
      include: { Entidades: true }
    });
  }
}
