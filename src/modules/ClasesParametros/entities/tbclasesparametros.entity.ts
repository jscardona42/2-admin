import 'reflect-metadata'
import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class TbClasesParametros {

    @Field(() => Number)
    clase_parametro_id: number 

    @Field(() => String)
    nombre: string
}