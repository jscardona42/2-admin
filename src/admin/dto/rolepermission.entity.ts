import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class RolesPermissions {
    @Field((type) => ID)
    id: number

    @Field((type) => Number)
    role_id: number

    @Field((type) => [String])
    permissions_menu: string[]

    @Field((type) => String)
    permissions?: string

}