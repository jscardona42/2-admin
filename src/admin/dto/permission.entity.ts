import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class Permissions {
    @Field((type) => ID)
    id: number

    @Field((type) => String)
    name?: string

    @Field((type) => String)
    permissions?: string
}