import { Field, ID, ObjectType } from "@nestjs/graphql"
import { RolesFuncionalidades } from "./rolesfuncionalidades.entity"

@ObjectType()
export class Roles {
    @Field((type) => ID)
    rol_id: number

    @Field((type) => String)
    rol: string

    @Field((type) => [RolesFuncionalidades], { nullable: true })
    RolesFuncionalidadesSec?: RolesFuncionalidades[]
}