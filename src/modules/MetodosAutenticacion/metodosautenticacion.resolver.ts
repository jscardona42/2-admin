import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateMetodoAutenticacionInput, FilterMetodosAutenticacionInput, UpdateMetodoAutenticacionInput } from './dto/metodosautenticacion.dto';
import { TbMetodosAutenticacion } from './entities/tbmetodosautenticacion.entity';
import { TbMetodosAutenticacionService } from './metodosautenticacion.service';



@Resolver(() => TbMetodosAutenticacion)
export class TbMetodosAutenticacionResolver {

    constructor(
        private readonly MetodosAutenticacionService: TbMetodosAutenticacionService
    ) { }

    @Query(() => [TbMetodosAutenticacion])
    async getMetodosAutenticacion(): Promise<any> {
        return this.MetodosAutenticacionService.getMetodosAutenticacion();
    }

    @Query(() => TbMetodosAutenticacion)
    async getMetodoAutenticacionById(
        @Args("metodo_autenticacion_id") metodo_autenticacion_id: number): Promise<any> {
        return this.MetodosAutenticacionService.getMetodoAutenticacionById(metodo_autenticacion_id);
    }

    @Query(() => [TbMetodosAutenticacion])
    async getFilterMetodosAutenticacion(
        @Args("data", { nullable: true }) data: FilterMetodosAutenticacionInput): Promise<any[]> {
        return this.MetodosAutenticacionService.getFilterMetodosAutenticacion(data);
    }

    @Mutation(() => TbMetodosAutenticacion)
    async createMetodoAutenticacion(@Args("data") data: CreateMetodoAutenticacionInput): Promise<any> {
        return this.MetodosAutenticacionService.createMetodoAutenticacion(data);
    }

    @Mutation(() => TbMetodosAutenticacion)
    async updateMetodoAutenticacion(@Args("data") data: UpdateMetodoAutenticacionInput): Promise<any> {
        return this.MetodosAutenticacionService.updateMetodoAutenticacion(data);
    }

    @Mutation(() => TbMetodosAutenticacion)
    async deleteMetodoAutenticacion(@Args("metodo_autenticacion_id") metodo_autenticacion_id: number): Promise<any> {
        return this.MetodosAutenticacionService.deleteMetodoAutenticacion(metodo_autenticacion_id);
    }
}