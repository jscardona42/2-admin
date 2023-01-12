import 'reflect-metadata'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { EstadoTipoUsuario } from '@prisma/client'

registerEnumType(EstadoTipoUsuario, {
    name: 'EstadoTipoUsuario'
})

@InputType()
export class CreateTipoUsuarioInput {

    @Field(() => String)
    @IsNotEmpty()
    nombre: string

}

@InputType()
export class UpdateTipoUsuarioInput {

    @Field(() => Number)
    @IsNotEmpty()
    tipo_usuario_id: number

    @Field(() => String, { nullable: true })
    nombre?: string

    @Field(() => EstadoTipoUsuario, { nullable: true })
    estado?: EstadoTipoUsuario

}

@InputType()
export class FilterTipoUsuariosInput {

    @Field(() => String, { nullable: true })
    nombre?: string

    @Field(() => EstadoTipoUsuario, { nullable: true })
    estado?: EstadoTipoUsuario

}