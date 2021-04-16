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
  async getPermissions() {
    return await this.adminService.getPermissions();
  }

  @Query((returns) => [Role], {
    name: 'roles',
    description: 'It returns all registered roles',
  })
  async getRoles(): Promise<Role[]> {
    return this.adminService.getRoles();
  }

  @Query((returns) => [RolesPermissions], {
    name: 'rolesPermissions',
    description: 'It returns all registered roles_Permissions',
  })
  async getRolesPermissions(): Promise<RolesPermissions[]> {
    return this.adminService.getRolesPermissions();
  }
}
