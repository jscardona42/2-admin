import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ChangePasswordInput, SignInUserInput, SignUpUserInput } from './dto/usuarios.dto';
import { Usuarios } from './entities/usuarios.entity';
import { UsuariosService } from './usuarios.service';

@Resolver(() => Usuarios)
export class UsuariosResolver {

    constructor(
        private readonly usuariosService: UsuariosService
    ) { }

    @Query(() => [Usuarios])
    async getUsuarios(): Promise<Usuarios[]> {
        return this.usuariosService.getUsuarios();
    }

    @Query(() => Usuarios)
    async getUsuarioById(
        @Args("usuario_id") usuario_id: number): Promise<Usuarios> {
        return this.usuariosService.getUsuarioById(usuario_id);
    }

    @Query(() => [Usuarios])
    async getFilterUsuarios(
        @Args("nombre", { nullable: true }) nombre: string,
        @Args("email", { nullable: true }) email: string): Promise<Usuarios[]> {
        return this.usuariosService.getFilterUsuarios(nombre, email);
    }

    @Query(returns => Usuarios)
    @UsePipes(ValidationPipe)
    async signInLogin(
        @Args("data") data: SignInUserInput): Promise<Usuarios> {
        return this.usuariosService.signInLogin(data);
    }

    @Mutation(returns => Usuarios)
    @UsePipes(ValidationPipe)
    async signUpLogin(
        @Args("data") data: SignUpUserInput): Promise<Usuarios> {
        return this.usuariosService.signUpLogin(data);
    }

    @Mutation(returns => Usuarios)
    @UsePipes(ValidationPipe)
    async logOutLogin(
        @Args("usuario_id") usuario_id: number): Promise<Usuarios> {
        return this.usuariosService.logOutLogin(usuario_id);
    }

    @Mutation(returns => Usuarios)
    @UsePipes(ValidationPipe)
    async exChangePasswordLogin(
        @Args("data") data: ChangePasswordInput): Promise<Usuarios> {
        return this.usuariosService.exChangePasswordLogin(data);
    }

}