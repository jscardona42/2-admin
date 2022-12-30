import 'reflect-metadata'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@InputType()
export class FilterFormulariosEmpresasInput {

    @Field(() => Boolean, { nullable: true })
    estado?: boolean

}

@InputType()
export class CreateFormularioEmpresaInput {

    @Field(() => Number)
    @IsNotEmpty()
    formulario_gestion_id: number

    @Field(() => Boolean)
    @IsNotEmpty()
    estado: boolean

}

@InputType()
export class UpdateFormularioEmpresaInput {

    @Field(() => Int)
    @IsNotEmpty()
    formulario_empresa_id: number

    @Field(() => Number, { nullable: true})
    formulario_gestion_id?: number

    @Field(() => Boolean, { nullable: true})
    estado?: boolean

}