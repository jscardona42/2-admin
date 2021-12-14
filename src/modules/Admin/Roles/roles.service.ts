import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { PermisosService } from '../Permisos/permisos.service';
import { AddPermisosToRolInput, CreateRolInput, UpdateRolInput } from './dto/roles.dto';
import { Roles } from './entities/roles.entity';

@Injectable()
export class RolesService {
  constructor(
    private prismaService: PrismaService,
    private permisosService: PermisosService,
  ) { }

  async getRoles(): Promise<any[]> {
    return this.prismaService.roles.findMany({
      include: { RolesPermisosSec: { include: { Permisos: true } } }
    });
  }

  async getRolById(rol_id: number): Promise<any> {
    var roles = await this.prismaService.roles.findUnique({
      where: { rol_id: rol_id },
      include: { RolesPermisosSec: { include: { Permisos: true } } }
    });

    if (roles === null) {
      throw new UnauthorizedException(`El rol con id ${rol_id} no existe`);
    }

    return roles;
  }

  async getFilterRoles(rol: string): Promise<any[]> {
    return this.prismaService.roles.findMany({
      where: { OR: [{ rol: { contains: rol, mode: "insensitive" } }] },
      include: { RolesPermisosSec: { include: { Permisos: true } } }
    });
  }

  async createRol(data: CreateRolInput): Promise<any> {

    await Promise.all(data.RolesPermisos.map(async (element, i) => {
      await this.permisosService.getPermisoById(element.permiso_id);
    }));

    return this.prismaService.roles.create({
      data: {
        rol: data.rol,
        RolesPermisosSec: { create: data.RolesPermisos }
      },
      include: { RolesPermisosSec: { include: { Permisos: true } } }
    });
  }

  async updateRol(data: UpdateRolInput): Promise<any> {

    await this.getRolById(data.rol_id);

    let rolesPermisos = await this.getRolesPermisosById(data.RolesPermisos.rol_permiso_id);

    if (data.rol_id !== rolesPermisos.rol_id) {
      throw new UnauthorizedException(`El rol permiso con id ${data.RolesPermisos.rol_permiso_id} no pertenece al rol ${data.rol_id}`);
    }

    await this.getRolesPermisosByRolIdAndPermisoId(data.rol_id, data.RolesPermisos.permiso_id);

    return this.prismaService.roles.update({
      where: { rol_id: data.rol_id },
      data: {
        rol: data.rol,
        RolesPermisosSec: {
          update: {
            where: { rol_permiso_id: data.RolesPermisos.rol_permiso_id },
            data: { permiso_id: data.RolesPermisos.permiso_id }
          }
        }
      },
      include: { RolesPermisosSec: { include: { Permisos: true } } }
    });
  }

  async deleteRol(rol_id: number): Promise<any> {

    await this.getRolById(rol_id);

    return this.prismaService.roles.delete({
      where: { rol_id: rol_id },
      include: { RolesPermisosSec: { include: { Permisos: true } } }
    });
  }

  async addPermisosToRol(data: AddPermisosToRolInput): Promise<any> {

    await Promise.all(data.RolesPermisos.map(async (element, i) => {
      await this.getRolesPermisosByRolIdAndPermisoId(data.rol_id, element.permiso_id);
      await this.permisosService.getPermisoById(element.permiso_id);
    }));

    return this.prismaService.roles.update({
      where: { rol_id: data.rol_id },
      data: {
        RolesPermisosSec: {
          create: data.RolesPermisos
        }
      },
      include: { RolesPermisosSec: { include: { Permisos: true } } }
    });
  }

  async getEntidadesIdsByRolId(rol_id: number): Promise<any[]> {
    return this.prismaService.rolesPermisos.findMany({
      where: { rol_id: rol_id },
      include: { Roles: true, Permisos: { include: { Entidades: true } } }
    });
  }

  async getRolesPermisosByRolIdAndPermisoId(rol_id: number, permiso_id: number) {
    let rolesPermisos = await this.prismaService.rolesPermisos.findFirst({
      where: { rol_id: rol_id, permiso_id: permiso_id },
      include: { Roles: true }
    });

    if (rolesPermisos !== null) {
      throw new UnauthorizedException(`El permiso con id ${rolesPermisos.permiso_id} ya está asociado al rol ${rolesPermisos.Roles.rol}`);
    }

    return rolesPermisos;
  }

  async getRolesPermisosById(rol_permiso_id) {
    let rolesPermisos = await this.prismaService.rolesPermisos.findUnique({
      where: { rol_permiso_id: rol_permiso_id },
    });

    return rolesPermisos;
  }


}
