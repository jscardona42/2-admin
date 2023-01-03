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

    @Query(() => [UsuariosParametros])
    async getUsuariosParametros(): Promise<UsuariosParametros[]> {
        return this.usuariosParametrosService.getUsuariosParametros();
    }

    @Query(() => UsuariosParametros, { description: "Obtener un elemento relacionado con el parámetro formulario_empresa" })
    async getUsuarioParametroById(@Args("usuario_parametro_id") usuario_parametro_id: number): Promise<UsuariosParametros> {
        return this.usuariosParametrosService.getUsuarioParametroById(usuario_parametro_id);
    }

    @Query(() => [UsuariosParametros], { description: "Obtener uno o varios elementos relacionado con los parámetros enviados al dto" })
    async getFilterUsuariosParametrosInput(@Args("data", { nullable: true }) data: FilterUsuariosParametrosInput): Promise<UsuariosParametros[]> {
        return this.usuariosParametrosService.getFilterUsuariosParametrosInput(data);
    }

    @Mutation(() => UsuariosParametros, { description: "Creación de un nuevo elemento para la tabla FormulariosEmpresas" })
    async createUsuarioParametro(@Args("data") data: CreateUsuarioParametroInput): Promise<UsuariosParametros> {
        return this.usuariosParametrosService.createUsuarioParametro(data);
    }

    @Mutation(() => UsuariosParametros, { description: "Actualización de un elemento de la tabla FormulariosEmpresas" })
    async updateUsuarioParametro(@Args("data") data: UpdateUsuarioParametroInput): Promise<UsuariosParametros> {
        return this.usuariosParametrosService.updateUsuarioParametro(data);
    }
    

}
