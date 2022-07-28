import 'reflect-metadata'
import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class TbMetodosAutenticacion {

    @Field(() => Number)
    metodo_autenticacion_id: number 

    @Field(() => String)
    nombre: string
}