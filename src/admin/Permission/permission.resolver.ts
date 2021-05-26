import { Query, Resolver } from '@nestjs/graphql';
import { Permissions } from './entities/permission.entity';
import { PermissionService } from './permission.service';

@Resolver((of) => Permissions)
export class PermissionResolver {
  constructor(
    private readonly permissionService: PermissionService,
  ) { }

  @Query((returns) => [Permissions])
  async getPermissions(): Promise<Permissions[]> {
    return this.permissionService.getPermissions();
  }
}
