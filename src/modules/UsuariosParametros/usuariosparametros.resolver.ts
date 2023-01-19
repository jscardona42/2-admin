import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { FormulariosGestion } from '../Referencias/FormulariosGestion/entities/formulariosgestion.entity';
import { UsuariosParametros } from './entities/usuariosparametros.entity';
import { UsuariosParametrosService } from './usuariosparametros.service';
import { CreateUsuarioParametroInput, FilterUsuariosParametrosInput, UpdateUsuarioParametroInput } from './dto/usuariosparametros.dto';

@Resolver(() => UsuariosParametros)
export class UsuariosParametrosResolver {
    constructor(
        private readonly usuariosParametrosService: UsuariosParametrosService,
    ) { }

    @Query(() => [UsuariosParametros], { description: "Obtener todos los elementos de la tabla UsuariosParametros"})
    async getUsuariosParametros(): Promise<UsuariosParametros[]> {
        return this.usuariosParametrosService.getUsuariosParametros();
    }

    @Query(() => UsuariosParametros, { description: "Obtener un elemento de la tabla UsuariosParametros por id" })
    async getUsuarioParametroById(@Args("usuario_parametro_id") usuario_parametro_id: number): Promise<UsuariosParametros> {
        return this.usuariosParametrosService.getUsuarioParametroById(usuario_parametro_id);
    }

    @Query(() => [UsuariosParametros], { description: "Obtener uno o varios elementos filtrados de la tabla UsuariosParametros" })
    async getFilterUsuariosParametrosInput(@Args("data", { nullable: true }) data: FilterUsuariosParametrosInput): Promise<UsuariosParametros[]> {
        return this.usuariosParametrosService.getFilterUsuariosParametrosInput(data);
    }

    @Mutation(() => UsuariosParametros, { description: "Crear un nuevo elemento en la tabla UsuariosParametros" })
    async createUsuarioParametro(@Args("data") data: CreateUsuarioParametroInput): Promise<UsuariosParametros> {
        return this.usuariosParametrosService.createUsuarioParametro(data);
    }

    @Mutation(() => UsuariosParametros, { description: "Actualizar un elemento de la tabla UsuariosParametros" })
    async updateUsuarioParametro(@Args("data") data: UpdateUsuarioParametroInput): Promise<UsuariosParametros> {
        return this.usuariosParametrosService.updateUsuarioParametro(data);
    }
    

}
