import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AddPermisosToFuncionalidadInput, CreateFuncionalidadInput, FilterFuncionalidadesInput, UpdateFuncionalidadInput } from './dto/funcionalidades.dto';
import { Funcionalidades } from './entities/funcionalidades.entity';
import { FuncionalidadesService } from './funcionalidades.service';

@Resolver((of) => Funcionalidades)
export class FuncionalidadesResolver {
    constructor(
        private readonly funcionalidadesService: FuncionalidadesService,
    ) { }

    @Query((returns) => [Funcionalidades])
    async getFuncionalidades(): Promise<Funcionalidades[]> {
        return this.funcionalidadesService.getFuncionalidades();
    }

    @Query((returns) => Funcionalidades)
    async getFuncionalidadById(@Args("funcionalidad_id") funcionalidad_id: number): Promise<Funcionalidades> {
        return this.funcionalidadesService.getFuncionalidadById(funcionalidad_id);
    }

    @Query(() => [Funcionalidades])
    async getFilterFuncionalidades(
        @Args("data", { nullable: true }) data: FilterFuncionalidadesInput): Promise<Funcionalidades[]> {
        return await this.funcionalidadesService.getFilterFuncionalidades(data);
    }

    @Mutation((returns) => Funcionalidades)
    async createFuncionalidad(@Args("data") data: CreateFuncionalidadInput): Promise<Funcionalidades> {
        return this.funcionalidadesService.createFuncionalidad(data);
    }

    @Mutation((returns) => Funcionalidades)
    async updateFuncionalidad(@Args("data") data: UpdateFuncionalidadInput): Promise<Funcionalidades> {
        return this.funcionalidadesService.updateFuncionalidad(data);
    }

    @Mutation((returns) => Funcionalidades)
    async addPermisosToFuncionalidad(@Args("data") data: AddPermisosToFuncionalidadInput): Promise<Funcionalidades> {
        return this.funcionalidadesService.addPermisosToFuncionalidad(data);
    }

    @Mutation((returns) => Funcionalidades)
    async deleteFuncionalidad(
        @Args("funcionalidad_id") funcionalidad_id: number): Promise<Funcionalidades> {
        return this.funcionalidadesService.deleteFuncionalidad(funcionalidad_id);
    }
}
