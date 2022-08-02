import 'reflect-metadata'
import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class TbTipoUsuarios {

    @Field(() => Number)
    tipo_usuario_id: number 

    @Field(() => String)
    nombre: string

    @Field(() => String)
    estado: string
}