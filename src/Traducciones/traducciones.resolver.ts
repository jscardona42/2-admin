import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateTraduccionesInput, UpdateTraduccionesInput } from './dto/traducciones.dto';
import { Traducciones } from './entities/traducciones.entity';
import { TraduccionesService } from './traducciones.service';

@Resolver(() => Traducciones)
export class TraduccionesResolver {
    constructor(private readonly traduccionesService: TraduccionesService) { }

    @Query(() => [Traducciones])
    async getTraducciones() {
        return this.traduccionesService.getTraducciones();
    }

    @Query(() => Traducciones)
    async getTraduccionById(@Args('traduccion_id') traduccion_id: number) {
        return this.traduccionesService.getTraduccionById(traduccion_id);
    }

    @Mutation(returns => Traducciones)
    async createTraduccion(
        @Args('data') data: CreateTraduccionesInput) {
        return this.traduccionesService.createTraduccion(data)
    }

    @Mutation(returns => Traducciones)
    async updateTraduccion(
        @Args('data') data: UpdateTraduccionesInput) {
        return this.traduccionesService.updateTraduccion(data)
    }

    @Mutation(() => Traducciones)
    async deleteTraduccion(@Args('traduccion_id') traduccion_id: number) {
        return this.traduccionesService.deleteTraduccion(traduccion_id);
    }

}
