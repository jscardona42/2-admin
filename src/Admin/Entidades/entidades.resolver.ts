import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateEntidadInput } from './dto/entidades.dto';
import { EntidadesService } from './entidades.service';
import { Entidades } from './entities/entidades.entity';

@Resolver((of) => Entidades)
export class EntidadesResolver {
    constructor(
        private readonly entidadesService: EntidadesService,
    ) { }

    @Query((returns) => [Entidades])
    async getEntidades(): Promise<Entidades[]> {
        return this.entidadesService.getEntidades();
    }

    @Query((returns) => Entidades)
    async getEntidadeById(@Args("entidad_id") entidad_id: number): Promise<Entidades> {
        return this.entidadesService.getEntidadeById(entidad_id);
    }

    @Query(() => [Entidades])
    async getFilterEntidades(
        @Args("nombre", { nullable: true }) nombre: string): Promise<Entidades[]> {
        return await this.entidadesService.getFilterEntidades(nombre);
    }

    @Mutation((returns) => Entidades)
    async updateEntidad(@Args("data") data: UpdateEntidadInput): Promise<Entidades> {
        return this.entidadesService.updateEntidad(data);
    }

    @Mutation((returns) => Entidades)
    async deleteEntidad(
        @Args("entidad_id") entidad_id: number
    ): Promise<Entidades> {
        return this.entidadesService.deleteEntidad(entidad_id);
    }
}
