import 'reflect-metadata'
import { Field, ObjectType, registerEnumType } from "@nestjs/graphql"
import { EstadoTipoUsuario } from '@prisma/client'

registerEnumType(EstadoTipoUsuario, {
    name: 'EstadoTipoUsuario'
})

@ObjectType()
export class TbTipoUsuarios {

    @Field(() => Number)
    tipo_usuario_id: number

    @Field(() => String)
    nombre: string

    @Field(() => EstadoTipoUsuario)
    estado: EstadoTipoUsuario
}