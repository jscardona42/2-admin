import 'reflect-metadata'
import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class TbRoles {

    @Field(() => Number)
    rol_id: number 

    @Field(() => String)
    nombre: string
}