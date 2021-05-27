import { Query, Resolver } from '@nestjs/graphql';
import { Permisos } from './entities/permisos.entity';
import { PermisosService } from './permisos.service';

@Resolver((of) => Permisos)
export class PermisosResolver {
  constructor(
    private readonly permissionService: PermisosService,
  ) { }

  @Query((returns) => [Permisos])
  async getPermisos(): Promise<Permisos[]> {
    return this.permissionService.getPermisos();
  }
}
