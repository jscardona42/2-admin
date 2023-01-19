import 'reflect-metadata'
import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class UsuariosSesiones {

    @Field(() => Int)
    usuario_sesion_id: number 

    @Field(() => Number)
    usuario_id: number

    @Field(() => String, { nullable: true })
    token?: string

    @Field(() => Date, { nullable: true })
    fecha_ultimo_login?: Date

}