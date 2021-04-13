import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Role } from './role.entity';
import { RolesPermissions } from './rolepermission.entity';

@Injectable()
export class AdminService {
  constructor(private prismaService: PrismaService) {}

  async findAllPermissions() {
    return this.prismaService.permissions.findMany();
  }

  async findAllRoles(): Promise<Role[]> {
    return this.prismaService.roles.findMany();
  }

  getMethods(TMPmethods, clsname: any) {
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

  async createPermissions(cls) {
    const moduleData = await this.prismaService.permissions.findFirst({
      where: {
        name: cls.nameClass,
      },
    });

    if (moduleData) {
      return this.prismaService.permissions.update({
        where: { id: moduleData.id },
        data: { permissions: JSON.stringify(cls.methods) },
      });
    } else {
      return this.prismaService.permissions.create({
        data: { name: cls.nameClass, permissions: JSON.stringify(cls.methods) },
      });
    }
  }

  async findAllRolesPermissions(): Promise<RolesPermissions[]> {
    return this.prismaService.roles_permissions.findMany();
  }
}
