import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateEstadosUsuariosInput, FilterEstadoUsuariosInput, UpdateEstadosUsuariosInput } from './dto/estadosusuarios.dto';
import { TbEstadosUsuarios } from './entities/tbestadosusuarios.entity';
import { TbEstadosUsuariosService } from './estadosusuarios.service';

@Resolver(() => TbEstadosUsuarios)
export class TbEstadosUsuariosResolver {

    constructor(
        private readonly EstadosUsuariosService: TbEstadosUsuariosService
    ) { }

    @Query(() => [TbEstadosUsuarios])
    async getEstadosUsuarios(): Promise<any> {
        return this.EstadosUsuariosService.getEstadosUsuarios();
    }

    @Query(() => TbEstadosUsuarios)
    async getEstadosUsuariosById(
        @Args("estado_usuario_id") estado_usuario_id: number): Promise<any> {
        return this.EstadosUsuariosService.getEstadosUsuariosById(estado_usuario_id);
    }

    @Query(() => [TbEstadosUsuarios])
    async getFilterEstadosUsuarios(
        @Args("data", { nullable: true }) data: FilterEstadoUsuariosInput): Promise<any[]> {
        return this.EstadosUsuariosService.getFilterEstadosUsuarios(data);
    }

    @Mutation(() => TbEstadosUsuarios)
    async createEstadosUsuarios(@Args("data") data: CreateEstadosUsuariosInput): Promise<any> {
        return this.EstadosUsuariosService.createEstadosUsuarios(data);
    }

    @Mutation(() => TbEstadosUsuarios)
    async updateEstadosUsuarios(@Args("data") data: UpdateEstadosUsuariosInput): Promise<any> {
        return this.EstadosUsuariosService.updateEstadosUsuarios(data);
    }

    @Mutation(() => TbEstadosUsuarios)
    async deleteEstadosUsuarios(
        @Args("estado_usuario_id") estado_usuario_id: number): Promise<any> {
        return this.EstadosUsuariosService.deleteEstadosUsuarios(estado_usuario_id);
    }
}