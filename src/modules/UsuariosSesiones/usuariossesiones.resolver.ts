import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UsuariosSesiones } from './entities/usuariosesiones.entity';
import { UsuariosSesionesService } from './usuariossesiones.service';

@Resolver(() => UsuariosSesiones)
export class UsuariosSesionesResolver {
    constructor(
        private readonly usuariosSesionesService: UsuariosSesionesService,
    ) { }

    @Query(() => [UsuariosSesiones], { description: "Obtener todos los elementos de la tabla UsuariosSesiones" })
    async getUsuariosSesiones(): Promise<UsuariosSesiones[]> {
        return this.usuariosSesionesService.getUsuariosSesiones();
    }

    @Query(() => UsuariosSesiones, { description: "Obtener un elemento de la tabla UsuariosSesiones por id" })
    async getUsuarioSesionById(@Args("usuario_sesion_id") usuario_sesion_id: number): Promise<UsuariosSesiones> {
        return this.usuariosSesionesService.getUsuarioSesionById(usuario_sesion_id);
    }
}