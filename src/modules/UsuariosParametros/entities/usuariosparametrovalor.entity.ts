import 'reflect-metadata'
import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class UsuariosParametros {

    @Field(() => Number)
    usuario_parametro_valor_id: number 

    @Field(() => Number)
    usuario_id: number

    @Field(() => Number)
    usuario_parametro_id: number

    @Field(() => String)
    valor: string

    @Field(() => UsuariosParametros)
    UsuariosParametros: UsuariosParametros
}