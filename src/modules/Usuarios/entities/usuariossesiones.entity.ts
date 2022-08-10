import 'reflect-metadata'
import { Field, ObjectType } from "@nestjs/graphql"
import { Usuarios } from './usuarios.entity'

@ObjectType()
export class UsuariosSesiones {

    @Field(() => Number)
    usuario_sesion_id: number

    @Field(() => Number)
    usuario_id: number

    @Field(() => String, { nullable: true })
    token?: string

    @Field(() => String)
    fecha_ultimo_login: string

    @Field(() => Usuarios)
    Usuarios: Usuarios
}