import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UsuariosHistoricoContrasenasService } from './usuarioshistoricocontrasenas.service';
import { UsuariosHistoricoContrasenas } from './entities/usuariohistoricocontrasenas.entity';

@Resolver(() => UsuariosHistoricoContrasenas)
export class UsuariosHistoricoContrasenasResolver {
    constructor(
        private readonly usuariosHistoricoContrasenasService: UsuariosHistoricoContrasenasService,
    ) { }

    @Query(() => [UsuariosHistoricoContrasenas], { description: "Obtener todos los elementos de la tabla UsuariosHistoricoContrasenas" })
    async getUsuariosHistoricoContrasenas(): Promise<UsuariosHistoricoContrasenas[]> {
        return this.usuariosHistoricoContrasenasService.getUsuariosHistoricoContrasenas();
    }

    @Query(() => UsuariosHistoricoContrasenas, { description: "Obtener un elemento de la tabla UsuariosHistoricoContrasenas por id" })
    async getUsuarioHistoricoContrasenaById(@Args("usu_historico_contrasena_id") usu_historico_contrasena_id: number): Promise<UsuariosHistoricoContrasenas> {
        return this.usuariosHistoricoContrasenasService.getUsuarioHistoricoContrasenaById(usu_historico_contrasena_id);
    }
}