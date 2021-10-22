import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRolPermisoMany, UpdateRolPermisoInput } from './dto/rolespermisos.dto';
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

    @Query((returns) => RolesPermisos)
    async getRolPermisoById(@Args("icono_id") icono_id: number): Promise<RolesPermisos> {
        return this.rolesPermissionService.getRolPermisoById(icono_id);
    }
  
    @Mutation((returns) => [RolesPermisos])
    async createRolPermiso(@Args("data") data: CreateRolPermisoMany): Promise<RolesPermisos[]> {
        return this.rolesPermissionService.createRolPermiso(data);
    }
  
    @Mutation((returns) => RolesPermisos)
    async updateRolPermiso(@Args("data") data: UpdateRolPermisoInput): Promise<RolesPermisos> {
        return this.rolesPermissionService.updateRolPermiso(data);
    }
  
    @Mutation((returns) => RolesPermisos)
    async deleteRolPermiso(@Args("icono_id") icono_id: number): Promise<RolesPermisos> {
        return this.rolesPermissionService.deleteRolPermiso(icono_id);
    }
}
