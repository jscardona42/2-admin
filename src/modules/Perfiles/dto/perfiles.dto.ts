import 'reflect-metadata'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { CreateFormularioPerfilInput, UpdateFormularioPerfilInput } from './formulariosperfiles.dto'
import { CreateFuncionalidadPerfilInput } from './funcionalidadesperfiles.dto'

@InputType()
export class FilterPerfilesInput {

    @Field(() => String, { nullable: true })
    nombre?: string

    @Field(() => Boolean, { nullable: true })
    personalizado?: boolean

    @Field(() => Boolean, { nullable: true })
    estado?: boolean

    @Field(() => String, { nullable: true })
    codigo?: string
}

@InputType()
export class CreatePerfilInput {

    @Field(() => String)
    @IsNotEmpty()
    nombre: string
    
    @Field(() => String)
    @IsNotEmpty()
    codigo: string

    @Field(() => Boolean)
    @IsNotEmpty()
    estado: boolean

    @Field(() => String, { nullable: true })
    descripcion?: string

    @Field(() => Boolean, { nullable: true })
    personalizado?: boolean

    @Field(() => [CreateFormularioPerfilInput], { nullable: true })
    FormulariosPerfiles?: CreateFormularioPerfilInput[]

    @Field(() => [CreateFuncionalidadPerfilInput], { nullable: true })
    FuncionalidadesPerfiles?: CreateFuncionalidadPerfilInput[]

}

@InputType()
export class UpdatePerfilInput {

    @Field(() => Int)
    @IsNotEmpty()
    perfil_id: number

    @Field(() => String, { nullable: true })
    nombre?: string

    @Field(() => Boolean, { nullable: true })
    estado?: boolean

    @Field(() => String, { nullable: true })
    codigo?: string

    @Field(() => String, { nullable: true })
    descripcion?: string

    @Field(() => Boolean, { nullable: true })
    personalizado?: boolean

    @Field(() => [CreateFormularioPerfilInput], { nullable: true })
    FormulariosPerfiles?: CreateFormularioPerfilInput[]

    @Field(() => [CreateFuncionalidadPerfilInput], { nullable: true })
    FuncionalidadesPerfiles?: CreateFuncionalidadPerfilInput[]

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