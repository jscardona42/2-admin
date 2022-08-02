import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateEstadoUsuarioInput, FilterEstadoUsuariosInput, UpdateEstadoUsuarioInput } from './dto/estadosusuarios.dto';
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
    async getEstadoUsuarioById(
        @Args("estado_usuario_id") estado_usuario_id: number): Promise<any> {
        return this.EstadosUsuariosService.getEstadoUsuarioById(estado_usuario_id);
    }

    @Query(() => [TbEstadosUsuarios])
    async getFilterEstadosUsuarios(
        @Args("data", { nullable: true }) data: FilterEstadoUsuariosInput): Promise<any[]> {
        return this.EstadosUsuariosService.getFilterEstadosUsuarios(data);
    }

    @Mutation(() => TbEstadosUsuarios)
    async createEstadoUsuario(@Args("data") data: CreateEstadoUsuarioInput): Promise<any> {
        return this.EstadosUsuariosService.createEstadoUsuario(data);
    }

    @Mutation(() => TbEstadosUsuarios)
    async updateEstadoUsuario(@Args("data") data: UpdateEstadoUsuarioInput): Promise<any> {
        return this.EstadosUsuariosService.updateEstadoUsuario(data);
    }

    @Mutation(() => TbEstadosUsuarios)
    async deleteEstadoUsuario(
        @Args("estado_usuario_id") estado_usuario_id: number): Promise<any> {
        return this.EstadosUsuariosService.deleteEstadoUsuario(estado_usuario_id);
    }
}