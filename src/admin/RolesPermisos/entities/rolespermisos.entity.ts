import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class RolesPermisos {
    @Field((type) => ID)
    rol_permiso_id: number

    @Field((type) => Number)
    rol_id: number

    @Field((type) => Number)
    permiso_id?: number
}