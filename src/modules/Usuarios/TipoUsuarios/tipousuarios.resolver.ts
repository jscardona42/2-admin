import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateTipoUsuarioInput, FilterTipoUsuariosInput, UpdateTipoUsuarioInput } from './dto/tipousuarios.dto';
import { TbTipoUsuarios } from './entities/tipousuarios.entity';
import { TbTipoUsuariosService } from './tipousuarios.service';


@Resolver(() => TbTipoUsuarios)
export class TbTipoUsuariosResolver {

    constructor(
        private readonly TipoUsuariosService: TbTipoUsuariosService
    ) { }

    @Query(() => [TbTipoUsuarios])
    async getTipoUsuarios(): Promise<any> {
        return this.TipoUsuariosService.getTipoUsuarios();
    }

    @Query(() => TbTipoUsuarios)
    async getTipoUsuarioById(
        @Args("tipo_usuario_id") tipo_usuario_id: number): Promise<any> {
        return this.TipoUsuariosService.getTipoUsuarioById(tipo_usuario_id);
    }

    @Query(() => [TbTipoUsuarios])
    async getFilterTipoUsuarios(
        @Args("data", { nullable: true }) data: FilterTipoUsuariosInput): Promise<any[]> {
        return this.TipoUsuariosService.getFilterTipoUsuarios(data);
    }

    @Mutation(() => TbTipoUsuarios)
    async createTipoUsuario(@Args("data") data: CreateTipoUsuarioInput): Promise<any> {
        return this.TipoUsuariosService.createTipoUsuario(data);
    }

    @Mutation(() => TbTipoUsuarios)
    async updateTipoUsuario(@Args("data") data: UpdateTipoUsuarioInput): Promise<any> {
        return this.TipoUsuariosService.updateTipoUsuario(data);
    }

    @Mutation(() => TbTipoUsuarios)
    async deleteTipoUsuario(@Args("tipo_usuario_id") tipo_usuario_id: number): Promise<any> {
        return this.TipoUsuariosService.deleteTipoUsuario(tipo_usuario_id);
    }
}