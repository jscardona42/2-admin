import 'reflect-metadata'
import { Field, Int, ObjectType } from "@nestjs/graphql"

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

}