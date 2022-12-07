import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { FormulariosGestion } from '../Referencias/FormulariosGestion/entities/formulariosgestion.entity';
import { FormulariosEmpresas } from './entities/formulariosempresas.entity';
import { FormulariosEmpresasService } from './formulariosempresas.service';

@Resolver(() => FormulariosEmpresas)
export class FormulariosEmpresasResolver {
    constructor(
        private readonly formulariosEmpresasService: FormulariosEmpresasService,
    ) { }

    @Query(() => [FormulariosEmpresas])
    async getFormulariosEmpresas(): Promise<FormulariosEmpresas[]> {
        return this.formulariosEmpresasService.getFormulariosEmpresas();
    }

    @Query(() => FormulariosEmpresas)
    async getFormularioEmpresaById(@Args("formulario_gestion_id") formulario_gestion_id: number): Promise<FormulariosEmpresas> {
        return this.formulariosEmpresasService.getFormularioEmpresaById(formulario_gestion_id);
    }

    @Query(() => [FormulariosEmpresas])
    async getFormularioEmpresaByUsuarioId(@Args("usuario_id") usuario_id: number)
    {
        return this.formulariosEmpresasService.getFormularioEmpresaByUsuarioId(usuario_id);
    }

    @ResolveField(() => FormulariosGestion)
    async FormulariosGestion(@Parent() FormulariosEmpresas: FormulariosEmpresas) {
        return { __typename: 'FormulariosGestion', formulario_gestion_id: FormulariosEmpresas.formulario_gestion_id };
    }
}
