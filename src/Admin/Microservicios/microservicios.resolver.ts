import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMicroservicioInput, UpdateMicroservicioInput } from './dto/microservicios.dto';
import { Microservicios } from './entities/microservicios.entity';
import { MicroserviciosService } from './microservicios.service';


@Resolver((of) => Microservicios)
export class MicroserviciosResolver {
    constructor(
        private readonly microserviciosService: MicroserviciosService,
    ) { }

    @Query((returns) => [Microservicios])
    async getMicroservicios(): Promise<Microservicios[]> {
        return this.microserviciosService.getMicroservicios();
    }

    @Query((returns) => Microservicios)
    async getMicroservicioById(@Args("microservicio_id") microservicio_id: number): Promise<Microservicios> {
        return this.microserviciosService.getMicroservicioById(microservicio_id);
    }

    @Query(() => [Microservicios])
    async getFilterMicroservicios(
        @Args("nombre", { nullable: true }) nombre: string): Promise<Microservicios[]> {
        return await this.microserviciosService.getFilterMicroservicios(nombre);
    }

    @Mutation((returns) => Microservicios)
    async createMicroservicio(@Args("data") data: CreateMicroservicioInput): Promise<Microservicios> {
        return this.microserviciosService.createMicroservicio(data);
    }

    @Mutation((returns) => Microservicios)
    async updateMicroservicio(@Args("data") data: UpdateMicroservicioInput): Promise<Microservicios> {
        return this.microserviciosService.updateMicroservicio(data);
    }

    @Mutation((returns) => Microservicios)
    async deleteMicroservicio(
        @Args("microservicio_id") microservicio_id: number
    ): Promise<Microservicios> {
        return this.microserviciosService.deleteMicroservicio(microservicio_id);
    }
}
