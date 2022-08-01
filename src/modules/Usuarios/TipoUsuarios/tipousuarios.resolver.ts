import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateTipoUsuariosInput, FilterTipoUsuariosInput, UpdateTipoUsuariosInput } from './dto/tipousuarios.dto';
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
    async createTipoUsuarios(@Args("data") data: CreateTipoUsuariosInput): Promise<any> {
        return this.TipoUsuariosService.createTipoUsuarios(data);
    }

    @Mutation(() => TbTipoUsuarios)
    async updateTipoUsuarios(@Args("data") data: UpdateTipoUsuariosInput): Promise<any> {
        return this.TipoUsuariosService.updateTipoUsuarios(data);
    }

    @Mutation(() => TbTipoUsuarios)
    async deleteTipoUsuarios(@Args("tipo_usuario_id") tipo_usuario_id: number): Promise<any> {
        return this.TipoUsuariosService.deleteTipoUsuarios(tipo_usuario_id);
    }
}