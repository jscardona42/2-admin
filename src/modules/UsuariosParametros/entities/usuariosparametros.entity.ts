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

    @Field(() => String, { nullable: true })
    descripcion?: string

    @Field(() => String, { nullable: true })
    valor_defecto?: string

    @Field(() => Boolean, { nullable: true })
    requerido?: boolean
}