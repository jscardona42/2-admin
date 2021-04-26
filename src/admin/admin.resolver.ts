import { Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { Permissions } from './dto/permission.entity';
import { Role } from './dto/role.entity';
import { RolesPermissions } from './dto/rolepermission.entity';

@Resolver((of) => Permissions)
export class AdminResolver {
  constructor(
    private readonly adminService: AdminService,
  ) { }

  @Query((returns) => [Permissions])
  async getPermissions(): Promise<Permissions[]> {
    return this.adminService.getPermissions();
  }

  @Query((returns) => [Role])
  async getRoles(): Promise<Role[]> {
    return this.adminService.getRoles();
  }

  @Query((returns) => [RolesPermissions])
  async getRolesPermissions(): Promise<RolesPermissions[]> {
    return this.adminService.getRolesPermissions();
  }
}
