import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class RolesMenus {
    @Field((type) => ID)
    roles_menu_id: number

    @Field((type) => Number)
    role_id: number

    @Field((type) => [String])
    permissions_menu: string[]
}