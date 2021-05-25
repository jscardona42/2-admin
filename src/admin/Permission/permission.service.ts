import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { PermissionPrincipalService } from '../PermissionPrincipal/permissionprincipal.service';
import { Permissions } from './entities/permission.entity';

@Injectable()
export class PermissionService {
  constructor(private prismaService: PrismaService, private permissionPrincipalService: PermissionPrincipalService) { }

  async getPermissions(): Promise<any[]> {
    return await this.prismaService.permissions.findMany();
  }

  getMethods(nameMethods) {
    var dataPermissions: any = [];
    var dataResolvers = [];
    var is_public = false;

    try {
      nameMethods.forEach(function (nameClass, i) {
        dataResolvers[i] = { name: nameClass.nameClass, permissions: nameClass.nameClass, is_public: is_public };
        nameClass.methods.forEach(function (nameMethod, j) {
          if (nameMethod.startsWith("ex")) {
            is_public = true;
          }
          dataPermissions[j] = { name: nameClass.nameClass, permissions: nameMethod, is_public: is_public };
        });
      });

      dataResolvers.forEach(permission => {
        this.permissionPrincipalService.createPermissionsPrincipal(permission);
      });

      setTimeout(() => {
        dataResolvers.concat(dataPermissions).forEach(permission => {
          this.createPermissions(permission);
        });
      }, 1500);


    } catch (error) {
      return JSON.stringify({ status: 400 });
    }

    return JSON.stringify({ status: 200 });
  }

  async createPermissions(cls): Promise<Permissions> {

    var permissions_principal = await this.prismaService.permissions_principal.findFirst({
      where: { name: cls.name },
      select: { permission_principal_id: true }
    })

    var permissions = await this.prismaService.permissions.findFirst({
      where: { permissions: cls.permissions }
    })

    if (permissions_principal !== null && permissions === null) {
      return this.prismaService.permissions.create({
        data: { permission_principal_id: permissions_principal.permission_principal_id, permissions: cls.permissions, is_public: cls.is_public },
      });
    } else {
      return this.prismaService.permissions.update({
        where: { id: permissions.id },
        data: { permission_principal_id: permissions_principal.permission_principal_id, permissions: cls.permissions, is_public: cls.is_public },
      });
    }
  }
}
