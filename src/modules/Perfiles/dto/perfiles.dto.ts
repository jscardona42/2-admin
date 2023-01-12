import 'reflect-metadata'
import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { CreateFormularioPerfilInput } from './formulariosperfiles.dto'
import { CreateFuncionalidadPerfilInput } from './funcionalidadesperfiles.dto'
import { EstadoPerfil } from '@prisma/client'

registerEnumType(EstadoPerfil, {
    name: 'EstadoPerfil',
});

@InputType()
export class FilterPerfilesInput {

    @Field(() => String, { nullable: true })
    nombre?: string

    @Field(() => Boolean, { nullable: true })
    personalizado?: boolean

    @Field(() => EstadoPerfil, { nullable: true })
    estado?: EstadoPerfil

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

    @Field(() => EstadoPerfil)
    @IsNotEmpty()
    estado: EstadoPerfil

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

    @Field(() => EstadoPerfil, { nullable: true })
    estado?: EstadoPerfil

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