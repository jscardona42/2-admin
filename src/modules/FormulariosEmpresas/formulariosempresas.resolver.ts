import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { FormulariosGestion } from '../Referencias/FormulariosGestion/entities/formulariosgestion.entity';
import { FormulariosEmpresas } from './entities/formulariosempresas.entity';
import { FormulariosEmpresasService } from './formulariosempresas.service';
import { CreateFormularioEmpresaInput, FilterFormulariosEmpresasInput, UpdateFormularioEmpresaInput } from './dto/formulariosempresas.dto';

@Resolver(() => FormulariosEmpresas)
export class FormulariosEmpresasResolver {
    constructor(
        private readonly formulariosEmpresasService: FormulariosEmpresasService,
    ) { }

    @Query(() => [FormulariosEmpresas], { description: "Obtener todos los elementos de la tabla FormulariosEmpresas" })
    async getFormulariosEmpresas(): Promise<FormulariosEmpresas[]> {
        return this.formulariosEmpresasService.getFormulariosEmpresas();
    }

    @Query(() => FormulariosEmpresas, { description: "Obtener un elemento de la tabla FormulariosEmpresas por id" })
    async getFormularioEmpresaById(@Args("formulario_empresa") formulario_empresa: number): Promise<FormulariosEmpresas> {
        return this.formulariosEmpresasService.getFormularioEmpresaById(formulario_empresa);
    }

    @Query(() => [FormulariosEmpresas], { description: "Obtener uno o varios elementos filtrados de la tabla FormulariosEmpresas" })
    async getFilterFormulariosEmpresas(@Args("data", { nullable: true }) data: FilterFormulariosEmpresasInput): Promise<FormulariosEmpresas[]> {
        return this.formulariosEmpresasService.getFilterFormulariosEmpresas(data);
    }

    @Mutation(() => FormulariosEmpresas, { description: "Crear un nuevo elemento en la tabla FormulariosEmpresas" })
    async createFormularioEmpresa(@Args("data") data: CreateFormularioEmpresaInput): Promise<FormulariosEmpresas> {
        return this.formulariosEmpresasService.createFormularioEmpresa(data);
    }

    @Mutation(() => FormulariosEmpresas, { description: "Actualizar un elemento de la tabla FormulariosEmpresas" })
    async updateFormularioEmpresa(@Args("data") data: UpdateFormularioEmpresaInput): Promise<FormulariosEmpresas> {
        return this.formulariosEmpresasService.updateFormularioEmpresa(data);
    }
    
    @Mutation(() => FormulariosEmpresas, { description: "Eliminar un elemento de la tabla FormulariosEmpresas" })
    async deleteFormularioEmpresa(@Args("formulario_empresa_id") formulario_empresa_id: number): Promise<FormulariosEmpresas> {
        return this.formulariosEmpresasService.deleteFormularioEmpresa(formulario_empresa_id);
    }

    @Query(() => [FormulariosEmpresas])
    async getFormularioEmpresaByUsuarioId(@Args("usuario_id") usuario_id: number) {
        return this.formulariosEmpresasService.getFormularioEmpresaByUsuarioId(usuario_id);
    }

    @ResolveField(() => FormulariosGestion)
    async FormulariosGestion(@Parent() FormulariosEmpresas: FormulariosEmpresas) {
        return { __typename: 'FormulariosGestion', formulario_gestion_id: FormulariosEmpresas.formulario_gestion_id };
    }
}
