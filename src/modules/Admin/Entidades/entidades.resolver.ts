import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateEntidadInput } from './dto/entidades.dto';
import { EntidadesService } from './entidades.service';
import { Entidades } from './entities/entidades.entity';

@Resolver(() => Entidades)
export class EntidadesResolver {
    constructor(
        private readonly entidadesService: EntidadesService,
    ) { }

    @Query(() => [Entidades])
    async getEntidades(): Promise<Entidades[]> {
        return this.entidadesService.getEntidades();
    }

    @Query(() => [Entidades])
    async getEntidadesForFormularios(): Promise<Entidades[]> {
        return this.entidadesService.getEntidadesForFormularios();
    }

    @Query(() => Entidades)
    async getEntidadForFormularios(@Args("entidad_id") entidad_id: number): Promise<Entidades> {
        return this.entidadesService.getEntidadForFormularios(entidad_id);
    }

    @Query(() => Entidades)
    async getEntidadeById(@Args("entidad_id") entidad_id: number): Promise<Entidades> {
        return this.entidadesService.getEntidadeById(entidad_id);
    }

    @Query(() => [Entidades])
    async getFilterEntidades(
        @Args("nombre", { nullable: true }) nombre: string): Promise<Entidades[]> {
        return this.entidadesService.getFilterEntidades(nombre);
    }

    @Mutation(() => Entidades)
    async updateEntidad(@Args("data") data: UpdateEntidadInput): Promise<Entidades> {
        return this.entidadesService.updateEntidad(data);
    }

    @Mutation(() => Entidades)
    async deleteEntidad(
        @Args("entidad_id") entidad_id: number
    ): Promise<Entidades> {
        return this.entidadesService.deleteEntidad(entidad_id);
    }

    @Mutation(() => [Entidades])
    async saveSecondaryEntities(): Promise<any> {
        return this.entidadesService.prepareSecondaryEntities();
    }
}
