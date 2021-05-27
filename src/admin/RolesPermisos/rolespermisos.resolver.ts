import { Query, Resolver } from '@nestjs/graphql';
import { RolesPermisos } from './entities/rolespermisos.entity';
import { RolesPermisosService } from './rolespermisos.service';

@Resolver((of) => RolesPermisos)
export class RolesPermisosResolver {
    constructor(
        private readonly rolesPermissionService: RolesPermisosService,
    ) { }

    @Query((returns) => [RolesPermisos])
    async getRolesPermisos(): Promise<RolesPermisos[]> {
        return this.rolesPermissionService.getRolesPermisos();
    }
}
