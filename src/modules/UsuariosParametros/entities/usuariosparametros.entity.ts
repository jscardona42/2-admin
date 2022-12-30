import 'reflect-metadata'
import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class UsuariosParametros {

    @Field(() => Number)
    usuario_parametro_id: number 

    @Field(() => String)
    nombre: string

    @Field(() => String)
    alias: string

    @Field(() => String)
    descripcion: string

    @Field(() => String)
    valor_defecto?: string

    @Field(() => Boolean)
    requerido?: boolean
}