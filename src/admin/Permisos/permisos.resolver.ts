import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdatePermisoInput } from './dto/permisos.dto';
import { Permisos } from './entities/permisos.entity';
import { PermisosService } from './permisos.service';

@Resolver((of) => Permisos)
export class PermisosResolver {
  constructor(
    private readonly permisosService: PermisosService,
  ) { }

  @Query((returns) => [Permisos])
  async getPermisos(): Promise<Permisos[]> {
    return this.permisosService.getPermisos();
  }

  @Query((returns) => Permisos)
  async getPermisoById(@Args("permiso_id") permiso_id: number): Promise<Permisos> {
    return this.permisosService.getPermisoById(permiso_id);
  }

  @Query((returns) => [Permisos])
  async getFilterPermisos(@Args("permiso") permiso: string): Promise<Permisos[]> {
    return this.permisosService.getFilterPermisos(permiso);
  }

  @Mutation((returns) => Permisos)
  async updatePermiso(@Args("data") data: UpdatePermisoInput): Promise<Permisos> {
    return this.permisosService.updatePermiso(data);
  }

  @Mutation((returns) => Permisos)
  async deletePermiso(@Args("permiso_id") permiso_id: number): Promise<Permisos> {
    return this.permisosService.deletePermiso(permiso_id);
  }

  @Mutation((returns) => [Permisos])
  async saveEntidadesPermisosValidaciones(): Promise<Permisos[]> {
    await this.permisosService.preparePermisos();
    return this.permisosService.getPermisos();
  }
}
