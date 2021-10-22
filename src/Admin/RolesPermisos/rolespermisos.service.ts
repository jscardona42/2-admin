import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { PermisosService } from '../Permisos/permisos.service';
import { RolesService } from '../Roles/roles.service';
import { CreateRolPermisoMany, UpdateRolPermisoInput } from './dto/rolespermisos.dto';
import { RolesPermisos } from './entities/rolespermisos.entity';

@Injectable()
export class RolesPermisosService {
  constructor(
    private prismaService: PrismaService,
    private rolesService: RolesService,
    private permisosService: PermisosService,
  ) { }


  async getRolesPermisos(): Promise<RolesPermisos[]> {
    return this.prismaService.rolesPermisos.findMany({
      include: { Roles: true, Permisos: { include: { Entidades: true } } }
    });
  }

  async getEntidadesIdsByRolId(rol_id: number): Promise<RolesPermisos[]> {
    return this.prismaService.rolesPermisos.findMany({
      where: { rol_id: rol_id },
      include: { Roles: true, Permisos: { include: { Entidades: true } } }
    });
  }

  async getRolPermisoById(rol_permiso_id: number): Promise<RolesPermisos> {
    var rolesPermisos = await this.prismaService.rolesPermisos.findUnique({
      where: { rol_permiso_id: rol_permiso_id },
      include: { Roles: true, Permisos: { include: { Entidades: true } } }
    });

    if (rolesPermisos === null) {
      throw new UnauthorizedException(`El rol permiso con id ${rol_permiso_id} no existe`);
    }

    return rolesPermisos;
  }

  async createRolPermiso(data: CreateRolPermisoMany): Promise<RolesPermisos[]> {

    data.data.forEach(async element => {
      await this.permisosService.getPermisoById(element.permiso_id);
      await this.rolesService.getRolById(element.rol_id);
    });

    const datos = await this.prismaService.rolesPermisos.createMany({
      data: data.data
    })

    return this.prismaService.rolesPermisos.findMany({
      take: datos.count,
      orderBy: { rol_permiso_id: "desc" },
      include: { Roles: true, Permisos: { include: { Entidades: true } } }
    });
  }

  async updateRolPermiso(data: UpdateRolPermisoInput): Promise<RolesPermisos> {

    await this.getRolPermisoById(data.rol_permiso_id);
    await this.permisosService.getPermisoById(data.permiso_id);
    await this.rolesService.getRolById(data.rol_id);

    return this.prismaService.rolesPermisos.update({
      where: { rol_permiso_id: data.rol_permiso_id },
      data: {
        ...data
      },
      include: { Roles: true, Permisos: { include: { Entidades: true } } }
    })
  }

  async deleteRolPermiso(rol_permiso_id: number): Promise<RolesPermisos> {

    await this.getRolPermisoById(rol_permiso_id);

    return this.prismaService.rolesPermisos.delete({
      where: { rol_permiso_id: rol_permiso_id },
      include: { Roles: true, Permisos: { include: { Entidades: true } } }
    });
  }

}
