import { Directive, ObjectType, Field, Int } from '@nestjs/graphql';
import { FormulariosEmpresas } from '../../../../modules/FormulariosEmpresas/entities/formulariosempresas.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields:"formulario_gestion_id")')
export class FormulariosGestion {
    @Field(() => Int)
    @Directive('@external')
    formulario_gestion_id: number;

    @Field(() => FormulariosEmpresas)
    FormulariosEmpresas?: FormulariosEmpresas;
}