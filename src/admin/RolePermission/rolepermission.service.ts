import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { RolesPermissions } from './entities/rolepermission.entity';

@Injectable()
export class RolePermissionService {
  constructor(private prismaService: PrismaService) { }


  async getRolesPermissions(): Promise<RolesPermissions[]> {
    return this.prismaService.roles_permissions.findMany();
  }
}
