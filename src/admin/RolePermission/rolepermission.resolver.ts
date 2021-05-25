import { Query, Resolver } from '@nestjs/graphql';
import { RolesPermissions } from './entities/rolepermission.entity';
import { RolePermissionService } from './rolepermission.service';

@Resolver((of) => RolesPermissions)
export class RolePermissionResolver {
    constructor(
        private readonly rolePermissionService: RolePermissionService,
    ) { }

    @Query((returns) => [RolesPermissions])
    async getRolesPermissions(): Promise<RolesPermissions[]> {
        return this.rolePermissionService.getRolesPermissions();
    }
}
