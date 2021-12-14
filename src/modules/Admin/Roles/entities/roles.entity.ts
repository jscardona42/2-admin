import { Field, ID, ObjectType } from "@nestjs/graphql"
import { RolesPermisos } from "./rolespermisos.entity"

@ObjectType()
export class Roles {
    @Field((type) => ID)
    rol_id: number

    @Field((type) => String)
    rol: string

    @Field((type) => [RolesPermisos])
    RolesPermisosSec: RolesPermisos[]
}