import 'reflect-metadata'
import { Field, Int, ObjectType } from "@nestjs/graphql"
import { UsuariosParametros } from '../../../modules/UsuariosParametros/entities/usuariosparametros.entity'

@ObjectType()
export class UsuariosParametrosValores {

    @Field(() => Int)
    usuario_parametro_valor_id: number

    @Field(() => Number)
    usuario_id: number

    @Field(() => Number)
    usuario_parametro_id: number

    @Field(() => String, { nullable: true })
    valor?: string

    @Field(() => UsuariosParametros, { nullable: true })
    UsuariosParametros?: UsuariosParametros

}