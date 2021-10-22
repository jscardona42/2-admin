import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateMetodoValidacionInput, UpdateMetodoValidacionInput } from './dto/metodosvalidacion.dto';
import { MetodosValidacion } from './entities/metodosvalidacion.entity';
import { MetodosValidacionService } from './metodosvalidacion.service';

@Resolver((of) => MetodosValidacion)
export class MetodosValidacionResolver {
    constructor(
        private readonly metodosValidacionService: MetodosValidacionService,
    ) { }

    @Query((returns) => [MetodosValidacion])
    async getMetodosValidacion(): Promise<MetodosValidacion[]> {
        return this.metodosValidacionService.getMetodosValidacion();
    }

    @Query((returns) => MetodosValidacion)
    async getMetodoValidacionById(@Args("metodo_validacion_id") metodo_validacion_id: number): Promise<MetodosValidacion> {
        return this.metodosValidacionService.getMetodoValidacionById(metodo_validacion_id);
    }

    @Query(() => [MetodosValidacion])
    async getFilterMetodosValidacion(@Args("metodo", { nullable: true }) metodo: string): Promise<MetodosValidacion[]> {
        return await this.metodosValidacionService.getFilterMetodosValidacion(metodo);
    }

    @Mutation((returns) => MetodosValidacion)
    async createMetodoValidacion(@Args("data") data: CreateMetodoValidacionInput): Promise<MetodosValidacion> {
        return this.metodosValidacionService.createMetodoValidacion(data);
    }

    @Mutation((returns) => MetodosValidacion)
    async updateMetodoValidacion(@Args("data") data: UpdateMetodoValidacionInput): Promise<MetodosValidacion> {
        return this.metodosValidacionService.updateMetodoValidacion(data);
    }

    @Mutation((returns) => MetodosValidacion)
    async deleteMetodoValidacion(@Args("metodo_validacion_id") metodo_validacion_id: number): Promise<MetodosValidacion> {
        return this.metodosValidacionService.deleteMetodoValidacion(metodo_validacion_id);
    }
}
