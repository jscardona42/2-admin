import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { FuncionalidadesService } from '../Funcionalidades/funcionalidades.service';
import { AddFuncionalidadesToRolInput, CreateRolInput, UpdateRolInput } from './dto/roles.dto';

@Injectable()
export class TbRolesService {
  constructor(
    private prismaService: PrismaService,
    private funcionalidadesService: FuncionalidadesService,
  ) { }

  async getRoles(): Promise<any[]> {
    return this.prismaService.tbRoles.findMany({
      orderBy: { rol_id: "asc" },
      include: { RolesFuncionalidades: { include: { Funcionalidades: { include: { FuncionalidadesPermisosSec: { include: { Permisos: true } }, Entidades: true } } } } },
    });
  }

  async getRolById(rol_id: number): Promise<any> {
    return this.prismaService.tbRoles.findUnique({
      where: { rol_id: rol_id },
      include: { RolesFuncionalidades: { include: { Funcionalidades: { include: { FuncionalidadesPermisosSec: { include: { Permisos: true } }, Entidades: true } } } } },
      rejectOnNotFound: () => new UnauthorizedException(`El rol con id ${rol_id} no existe`)
    });
  }

  async getFilterRoles(nombre: string): Promise<any[]> {
    return this.prismaService.tbRoles.findMany({
      where: { OR: [{ nombre: { contains: nombre, mode: "insensitive" } }] },
      orderBy: { rol_id: "asc" },
      include: { RolesFuncionalidades: { include: { Funcionalidades: { include: { FuncionalidadesPermisosSec: { include: { Permisos: true } }, Entidades: true } } } } },
    });
  }

  async createRol(data: CreateRolInput): Promise<any> {
    await Promise.all(data.RolesFuncionalidades.map(async (element) => {
      await this.funcionalidadesService.getFuncionalidadById(element.funcionalidad_id);
    }));

    return this.prismaService.tbRoles.create({
      data: {
        nombre: data.rol,
        RolesFuncionalidades: { create: data.RolesFuncionalidades }
      },
      include: { RolesFuncionalidades: { include: { Funcionalidades: { include: { FuncionalidadesPermisosSec: { include: { Permisos: true } }, Entidades: true } } } } },
    });
  }

  async updateRol(data: UpdateRolInput): Promise<any> {
    let updateRolesFuncionalidades = [];
    await this.getRolById(data.rol_id);

    await Promise.all(data.RolesFuncionalidades.map(async (element) => {
      await this.funcionalidadesService.getFuncionalidadById(element.funcionalidad_id);
      await this.getRolesPermisosByRolIdAndPermisoId(data.rol_id, element.funcionalidad_id);
      await this.getRolesFuncionalidadesById(element.rol_funcionalidad_id, data.rol_id);

      updateRolesFuncionalidades.push({
        where: { rol_funcionalidad_id: element.rol_funcionalidad_id },
        data: { funcionalidad_id: element.funcionalidad_id }
      });
    }));

    return this.prismaService.tbRoles.update({
      where: { rol_id: data.rol_id },
      data: {
        nombre: data.rol,
        RolesFuncionalidades: {
          update: updateRolesFuncionalidades
        }
      },
      include: { RolesFuncionalidades: { include: { Funcionalidades: { include: { FuncionalidadesPermisosSec: { include: { Permisos: true } }, Entidades: true } } } } },
    });
  }

  async deleteRol(rol_id: number): Promise<any> {
    await this.getRolById(rol_id);

    return this.prismaService.tbRoles.delete({
      where: { rol_id: rol_id },
      include: { RolesFuncionalidades: { include: { Funcionalidades: { include: { FuncionalidadesPermisosSec: { include: { Permisos: true } }, Entidades: true } } } } },
    });
  }

  async addFuncionalidadesToRol(data: AddFuncionalidadesToRolInput): Promise<any> {

    await this.getRolById(data.rol_id);
    await Promise.all(data.RolesFuncionalidades.map(async (element) => {
      await this.funcionalidadesService.getFuncionalidadById(element.funcionalidad_id);
      await this.getRolesPermisosByRolIdAndPermisoId(data.rol_id, element.funcionalidad_id);
    }));

    return this.prismaService.tbRoles.update({
      where: { rol_id: data.rol_id },
      data: {
        RolesFuncionalidades: {
          create: data.RolesFuncionalidades
        }
      },
      include: { RolesFuncionalidades: { include: { Funcionalidades: { include: { FuncionalidadesPermisosSec: { include: { Permisos: true } }, Entidades: true } } } } },
    });
  }

  async getRolesPermisosByRolIdAndPermisoId(rol_id: number, funcionalidad_id: number) {
    let rolesFuncionalidades = await this.prismaService.rolesFuncionalidades.findFirst({
      where: { rol_id: rol_id, funcionalidad_id: funcionalidad_id },
      include: { TbRoles: true }
    });

    if (rolesFuncionalidades !== null) {
      throw new UnauthorizedException(`La funcionalidad con id ${rolesFuncionalidades.funcionalidad_id} ya está asociada al rol con id ${rolesFuncionalidades.TbRoles.rol_id}`);
    }
  }

  async getRolesFuncionalidadesById(rol_funcionalidad_id: number, rol_id: number) {
    let rolesFuncionalidades = await this.prismaService.rolesFuncionalidades.findUnique({
      where: { rol_funcionalidad_id: rol_funcionalidad_id },
      rejectOnNotFound: () => new UnauthorizedException(`El rol funcionalidad con id ${rol_funcionalidad_id} no existe`)
    });

    if (rol_id !== rolesFuncionalidades.rol_id) {
      throw new UnauthorizedException(`El rol funcionalidad con id ${rol_funcionalidad_id} no pertenece al rol con id ${rol_id}`);
    }
  }

  async getEntidadesIdsByRolId(rol_id: number): Promise<any[]> {
    return this.prismaService.rolesFuncionalidades.findMany({
      where: { rol_id: rol_id },
      include: { Funcionalidades: { include: { Entidades: true } } }
    });
  }

}
