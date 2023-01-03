import 'reflect-metadata'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@InputType()
export class CreateFormularioPerfilInput {

    @Field(() => Number)
    @IsNotEmpty()
    formulario_empresa_id: number

}

@InputType()
export class UpdateFormularioPerfilInput {

    @Field(() => Int)
    @IsNotEmpty()
    formulario_perfil_id: number

    @Field(() => Number, {nullable: true})
    formulario_empresa_id?: number

}
