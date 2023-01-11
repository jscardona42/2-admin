import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { FormulariosEmpresas } from '../../../modules/FormulariosEmpresas/entities/formulariosempresas.entity';
import { FormulariosEmpresasService } from '../../../modules/FormulariosEmpresas/formulariosempresas.service';
import { FormulariosGestion } from './entities/formulariosgestion.entity';

@Resolver(() => FormulariosGestion)
export class FormulariosGestionResolver {
    constructor(private readonly formulariosEmpresasService: FormulariosEmpresasService) { }

    @ResolveField(() => [FormulariosEmpresas])
    public FormulariosEmpresas(@Parent() formulariosGestion: FormulariosGestion) {
        return this.formulariosEmpresasService.getFormularioEmpresaById(formulariosGestion.formulario_gestion_id);
    }
}