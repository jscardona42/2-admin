import 'reflect-metadata'
import { Field, ObjectType } from "@nestjs/graphql"
import { UsuariosParametros } from './usuariosparametros.entity'

@ObjectType()
export class usuariosParametrosValores {

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