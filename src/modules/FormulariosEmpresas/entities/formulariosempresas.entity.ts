import 'reflect-metadata';
import { Directive, Field, Int, ObjectType } from "@nestjs/graphql"
import { FormulariosGestion } from '../../../modules/Referencias/FormulariosGestion/entities/formulariosgestion.entity';

@ObjectType()
@Directive('@key(fields:"formulario_empresa_id")')
export class FormulariosEmpresas {
    @Field(() => Int)
    formulario_empresa_id: number

    @Field(() => Number)
    formulario_gestion_id: number

    @Field(() => Boolean)
    estado: boolean

    @Field(() => FormulariosGestion)
    FormulariosGestion?: FormulariosGestion;
}