import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { CreateRolInput, UpdateRolInput } from './dto/roles.dto';
import { Roles } from './entities/roles.entity';

@Injectable()
export class RolesService {
  constructor(private prismaService: PrismaService) { }

  async getRoles(): Promise<Roles[]> {
    return this.prismaService.roles.findMany();
  }

  async getRolById(rol_id: number): Promise<Roles> {
    var roles = await this.prismaService.roles.findUnique({
      where: { rol_id: rol_id }
    });

    if (roles === null) {
      throw new UnauthorizedException(`El rol con id ${rol_id} no existe`);
    }

    return roles;
  }

  async getFilterRoles(rol: string): Promise<Roles[]> {
    return this.prismaService.roles.findMany({
      where: { OR: [{ rol: { contains: rol, mode: "insensitive" } }] }
    });
  }

  async createRol(data: CreateRolInput): Promise<Roles> {
    return this.prismaService.roles.create({
      data: { rol: data.rol }
    });
  }

  async updateRol(data: UpdateRolInput): Promise<Roles> {

    await this.getRolById(data.rol_id);

    return this.prismaService.roles.update({
      where: { rol_id: data.rol_id },
      data: { rol: data.rol }
    });
  }

  async deleteRol(rol_id: number): Promise<Roles> {

    await this.getRolById(rol_id);

    return this.prismaService.roles.delete({
      where: { rol_id: rol_id }
    });
  }


}
