import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Permissions } from './dto/permission.entity';
import { Role } from './dto/role.entity';
import { RolesPermissions } from './dto/rolepermission.entity';

@Injectable()
export class AdminService {
  constructor(private prismaService: PrismaService) { }

  async getPermissions(): Promise<Permissions[]> {
    return await this.prismaService.permissions.findMany();
  }

  async getRoles(): Promise<Role[]> {
    return this.prismaService.roles.findMany();
  }

  getMethods(TMPmethods, clsname: any): string {
    var nameMethods = [{ nameClass: clsname, methods: TMPmethods }];
    var nameMethods1 = nameMethods.filter(
      (method) => !method.nameClass.includes('Service'),
    );

    var data: any = [];
    var status: any = {};

    status = {
      status: 400,
    };

    if (nameMethods1.length > 0) {
      data = this.createPermissions(nameMethods1[0]);
      status = { status: 200 };
    }

    return JSON.stringify(status);
  }

  async createPermissions(cls): Promise<Permissions> {
    const moduleData = await this.prismaService.permissions.findFirst({
      where: { name: cls.nameClass },
    });

    if (moduleData) {
      return this.prismaService.permissions.update({
        where: { id: moduleData.id },
        data: { permissions: JSON.stringify(cls.methods) },
      });
    }
    return this.prismaService.permissions.create({
      data: { name: cls.nameClass, permissions: JSON.stringify(cls.methods) },
    });

  }

  async getRolesPermissions(): Promise<RolesPermissions[]> {
    return this.prismaService.roles_permissions.findMany();
  }
}
