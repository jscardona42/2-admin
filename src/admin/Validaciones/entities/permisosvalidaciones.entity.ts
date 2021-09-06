import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Permisos } from "../../../Admin/Permisos/entities/permisos.entity"

@ObjectType()
export class PermisosValidaciones {
    @Field((type) => ID)
    permiso_validacion_id: number

    @Field((type) => Permisos)
    Permisos: Permisos

    @Field((type) => Number)
    validacion_id: number

}