import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Permisos } from "../../../Admin/Permisos/entities/permisos.entity"
import { Roles } from "../../../Admin/Roles/entities/roles.entity"

@ObjectType()
export class RolesPermisos {
    @Field((type) => ID)
    rol_permiso_id: number

    @Field((type) => Roles)
    Roles: Roles

    @Field((type) => Permisos)
    Permisos: Permisos
}