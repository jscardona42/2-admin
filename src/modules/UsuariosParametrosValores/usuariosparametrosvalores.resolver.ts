import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UsuariosParametrosValores } from './entities/usuariosparametrosvalores.entity';
import { UsuariosParametrosValoresService } from './usuariosparametrosvalores.service';

@Resolver(() => UsuariosParametrosValores)
export class UsuariosParametrosValoresResolver {
    constructor(
        private readonly usuariosParametrosValoresService: UsuariosParametrosValoresService,
    ) { }

    @Query(() => [UsuariosParametrosValores], { description: "Obtener todos los elementos de la tabla UsuariosParametrosValores" })
    async getUsuariosParametrosValores(): Promise<UsuariosParametrosValores[]> {
        return this.usuariosParametrosValoresService.getUsuariosParametrosValores();
    }

    @Query(() => UsuariosParametrosValores, { description: "Obtener un elemento de la tabla UsuariosParametrosValores por id" })
    async getUsuarioParametroValorById(@Args("usuario_parametro_valor_id") usuario_parametro_valor_id: number): Promise<UsuariosParametrosValores> {
        return this.usuariosParametrosValoresService.getUsuarioParametroValorById(usuario_parametro_valor_id);
    }
}