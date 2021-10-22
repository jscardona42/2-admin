import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateValidacionInput } from './dto/validaciones.dto';
import { PermisosValidaciones } from './entities/permisosvalidaciones.entity';
import { Validaciones } from './entities/validaciones.entity';
import { ValidacionesService } from './validaciones.service';

@Resolver((of) => Validaciones)
export class ValidacionesResolver {
    constructor(
        private readonly validacionesService: ValidacionesService,
    ) { }

    @Query((returns) => [Validaciones])
    async getValidaciones(): Promise<Validaciones[]> {
        return this.validacionesService.getValidaciones();
    }

    @Query((returns) => [PermisosValidaciones])
    async getPermisosValidaciones(): Promise<PermisosValidaciones[]> {
        return this.validacionesService.getPermisosValidaciones();
    }

    @Query((returns) => Validaciones)
    async getValidacionById(@Args("validacion_id") validacion_id: number): Promise<Validaciones> {
        return this.validacionesService.getValidacionById(validacion_id);
    }

    @Query((returns) => PermisosValidaciones)
    async getPermisoValidacionById(@Args("permiso_validacion_id") permiso_validacion_id: number): Promise<PermisosValidaciones> {
        return this.validacionesService.getPermisoValidacionById(permiso_validacion_id);
    }

    @Mutation((returns) => Validaciones)
    async updateValidacion(@Args("data") data: UpdateValidacionInput): Promise<Validaciones> {
        return this.validacionesService.updateValidacion(data);
    }

    @Mutation((returns) => Validaciones)
    async deleteValidacion(@Args("validacion_id") validacion_id: number): Promise<Validaciones> {
        return this.validacionesService.deleteValidacion(validacion_id);
    }
}
