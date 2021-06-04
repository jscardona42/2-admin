import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CreateUsuarioInput, UpdateUsuarioInput } from './dto/usuarios.dto';
import { Usuarios } from './entities/usuarios.entity';
import { UsuariosService } from './usuarios.service';

@Resolver(() => Usuarios)
export class UsuariosResolver {

    constructor(
        private readonly usuariosService: UsuariosService
    ) { }

    @Query(() => [Usuarios])
    async getUsuarios(): Promise<Usuarios[]> {
        return await this.usuariosService.getUsuarios();
    }

    @Mutation(returns => Usuarios)
    @UsePipes(ValidationPipe)
    async createUsuario(
        @Args("data") data: CreateUsuarioInput): Promise<Usuarios> {
        return this.usuariosService.createUsuario(data);
    }

    @Mutation(returns => Usuarios)
    @UsePipes(ValidationPipe)
    async updateUsuario(
        @Args("data") data: UpdateUsuarioInput): Promise<Usuarios> {
        return this.usuariosService.updateUsuario(data);
    }

    @Mutation(returns => Usuarios)
    @UsePipes(ValidationPipe)
    async deleteUsuario(
        @Args("usuario_id") usuario_id: number): Promise<Usuarios> {
        return this.usuariosService.deleteUsuario(usuario_id);
    }

}
