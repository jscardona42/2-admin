import 'reflect-metadata'
import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class TbEstadosUsuarios {

    @Field(() => Number)
    estado_usuario_id: number 

    @Field(() => String)
    nombre: string
}