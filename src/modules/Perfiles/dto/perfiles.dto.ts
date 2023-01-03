import 'reflect-metadata'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { CreateFormularioPerfilInput, UpdateFormularioPerfilInput } from './formulariosperfiles.dto'

@InputType()
export class FilterPerfilesInput {

    @Field(() => String, { nullable: true })
    nombre?: string

    @Field(() => Boolean, { nullable: true })
    personalizado?: boolean

}

@InputType()
export class CreatePerfilInput {

    @Field(() => String)
    @IsNotEmpty()
    nombre: string

    @Field(() => String, { nullable: true })
    descripcion?: string

    @Field(() => Boolean, { nullable: true })
    personalizado?: boolean

    @Field(() => [CreateFormularioPerfilInput], { nullable: true })
    FormulariosPerfiles?: CreateFormularioPerfilInput[]

}

@InputType()
export class UpdatePerfilInput {

    @Field(() => Int)
    @IsNotEmpty()
    perfil_id: number

    @Field(() => String, { nullable: true })
    nombre?: string

    @Field(() => String, { nullable: true })
    descripcion?: string

    @Field(() => Boolean, { nullable: true })
    personalizado?: boolean

    @Field(() => [UpdateFormularioPerfilInput], { nullable: true })
    FormulariosPerfiles?: UpdateFormularioPerfilInput[]

}

@InputType()
export class AddFormulariosPerfilesToPerfilInput {

    @Field(() => Int)
    @IsNotEmpty()
    perfil_id: number

    @Field(() => [CreateFormularioPerfilInput])
    @IsNotEmpty()
    FormulariosPerfiles: CreateFormularioPerfilInput[]

}