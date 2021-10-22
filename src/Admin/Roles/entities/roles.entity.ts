import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class Roles {
    @Field((type) => ID)
    rol_id: number

    @Field()
    rol: string
}