import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FuncionalidadesPerfilesService } from 'src/modules/FuncionalidadesPerfiles/funcionalidadesperfiles.service';
import { FuncionalidadesPerfiles } from '../../../modules/FuncionalidadesPerfiles/entities/funcionalidadesperfiles.entity';
import { Funcionalidades } from './entities/funcionalidades.entity';

@Resolver(() => Funcionalidades)
export class FuncionalidadesResolver {
    constructor(private readonly funcionalidadesPerfilesService: FuncionalidadesPerfilesService) { }

    @ResolveField(() => [FuncionalidadesPerfiles])
    public FuncionalidadesPerfiles(@Parent() funcionalidades: Funcionalidades) {
        console.log(funcionalidades.funcionalidad_id);
        return this.funcionalidadesPerfilesService.getFuncionalidadPerfilById(funcionalidades.funcionalidad_id);
    }
}