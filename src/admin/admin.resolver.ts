import { Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma.service';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from '../admin/admin.service';
import { Permissions } from './permission.entity';
import { Role } from './role.entity';
import { RolesPermissions } from './rolepermission.entity';

@Resolver((of) => Permissions)
export class AdminResolver {
  constructor(
    @Inject(PrismaService) private prismaService: PrismaService,
    private jwtService: JwtService,
    private adminService: AdminService,
  ) {}

  @Query((returns) => [Permissions])
  async findAllPermissions() {
    return await this.adminService.findAllPermissions();
  }

  @Query((returns) => [Role], {
    name: 'roles',
    description: 'It returns all registered roles',
  })
  async findAllRoles(): Promise<Role[]> {
    return this.adminService.findAllRoles();
  }

  @Query((returns) => [RolesPermissions], {
    name: 'rolesPermissions',
    description: 'It returns all registered roles_Permissions',
  })
  async findAllRolesPermissions(): Promise<RolesPermissions[]> {
    return this.adminService.findAllRolesPermissions();
  }
}
