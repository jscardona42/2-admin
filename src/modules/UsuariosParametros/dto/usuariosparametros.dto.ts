import 'reflect-metadata'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsNotEmpty, isNotEmpty } from 'class-validator'

@InputType()
export class FilterUsuariosParametrosInput {

    @Field(() => String, { nullable: true })
    nombre?: string

    @Field(() => String, { nullable: true })
    alias?: string
}

@InputType()
export class CreateUsuarioParametroInput {

    @Field(() => String)
    @IsNotEmpty()
    nombre: string

    @Field(() => String)
    @IsNotEmpty()
    alias: string

    @Field(() => Boolean, { nullable: true })
    requerido?: boolean

    @Field(() => String, { nullable: true })
    valor_defecto?: string

    @Field(() => String)
    descripcion: string

}

@InputType()
export class UpdateUsuarioParametroInput {

    @Field(() => Int)
    @IsNotEmpty()
    usuario_parametro_id: number

    @Field(() => String, { nullable: true })
    nombre?: string

    @Field(() => String, { nullable: true })
    alias?: string

    @Field(() => Boolean, { nullable: true })
    requerido?: boolean

    @Field(() => String, { nullable: true })
    valor_defecto?: string

    @Field(() => String, { nullable: true })
    descripcion?: string

}