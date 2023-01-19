import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { FormulariosGestion } from '../Referencias/FormulariosGestion/entities/formulariosgestion.entity';
import { Funcionalidades } from '../Referencias/Funcionalidades/entities/funcionalidades.entity';
import { FuncionalidadesPerfiles } from './entities/funcionalidadesperfiles.entity';
import { FuncionalidadesPerfilesService } from './funcionalidadesperfiles.service';

@Resolver(() => FuncionalidadesPerfiles)
export class FuncionalidadesPerfilesResolver {
    constructor(
        private readonly funcionalidadesPerfilesService: FuncionalidadesPerfilesService,
    ) { }

    @Query(() => [FuncionalidadesPerfiles], { description: "Obtener todos los elementos de la tabla ${nombre de la tabla}" })
    async getFuncionalidadesPerfiles(): Promise<FuncionalidadesPerfiles[]> {
        return this.funcionalidadesPerfilesService.getFuncionalidadesPerfiles();
    }

    @Query(() => FuncionalidadesPerfiles, { description: "Obtener un elemento de la tabla ${nombre de la tabla} por id" })
    async getFuncionalidadPerfilById(@Args("funcionalidad_perfil_id") funcionalidad_perfil_id: number): Promise<FuncionalidadesPerfiles> {
        return this.funcionalidadesPerfilesService.getFuncionalidadPerfilById(funcionalidad_perfil_id);
    }

    @Query(() => [FuncionalidadesPerfiles], { description: "d" })
    async getFuncionalidadesPerfilesByUsuarioId(@Args("usuario_id") usuario_id: number) {
        return this.funcionalidadesPerfilesService.getFuncionalidadesPerfilesByUsuarioId(usuario_id);
    }

    @ResolveField(() => Funcionalidades, { description: "d" })
    async Funcionalidades(@Parent() FuncionalidadesPerfiles: FuncionalidadesPerfiles) {
        return { __typename: 'Funcionalidades', funcionalidad_id: FuncionalidadesPerfiles.funcionalidad_id };
    }
}
