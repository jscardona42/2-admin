import 'reflect-metadata'
import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql"
import { FormulariosEmpresas } from 'src/modules/FormulariosEmpresas/entities/formulariosempresas.entity'

@ObjectType()
export class FormulariosPerfiles {

    @Field(() => Int)
    formulario_perfil_id: number

    @Field(() => Number)
    formulario_empresa_id: number

    @Field(() => Number)
    perfil_id: number

    @Field(() => [FormulariosEmpresas], { nullable: true })
    FormulariosEmpresas?: FormulariosEmpresas[]

}