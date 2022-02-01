import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Permisos } from "../../../GestiónFuncionalidades/Permisos/entities/permisos.entity"
import { Validaciones } from "./validaciones.entity"

@ObjectType()
export class PermisosValidaciones {
    @Field((type) => ID)
    permiso_validacion_id: number

    @Field((type) => Permisos)
    Permisos: Permisos

    @Field((type) => Validaciones)
    ValidacionesSec: Validaciones

}