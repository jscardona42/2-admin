import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class Permissions {
    @Field((type) => ID)
    id: number

    @Field((type) => Number)
    permission_principal_id?: number

    @Field((type) => String)
    permissions?: string

    @Field((type) => Boolean)
    is_public?: boolean

}