import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class PermissionsPrincipal {
    @Field((type) => ID)
    permissions_principal_id: number

    @Field((type) => String)
    name?: string

}