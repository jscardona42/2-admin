import 'reflect-metadata'
import { Field, ObjectType } from "@nestjs/graphql"
import { Usuarios } from './usuarios.entity'

@ObjectType()
export class UsuariosHistoricoContrasenas {

    @Field(() => Number)
    usu_historico_contrasena_id: number 

    @Field(() => Number)
    usuario_id: number

    @Field(() => String)
    contrasena?: string

    @Field(() => String)
    fecha_actualizacion: string

    @Field(() => [Usuarios])
    Usuarios: Usuarios[]
}