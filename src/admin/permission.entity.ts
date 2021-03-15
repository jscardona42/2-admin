import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class Permissions {
    @Field((type) => ID)
    id: number

    @Field()
    name: string

    @Field()
    methodclass: string
}