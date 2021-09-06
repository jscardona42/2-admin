import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Microservicios } from "../../../Admin/Microservicios/entities/microservicios.entity"
import { PermisosValidaciones } from "./permisosvalidaciones.entity"

@ObjectType()
export class Validaciones {
    @Field((type) => ID)
    validacion_id: number

    @Field((type) => Microservicios)
    Microservicios: Microservicios

    @Field((type) => String)
    id_referenciado: string

    @Field((type) => [PermisosValidaciones])
    PermisosValidaciones: PermisosValidaciones[]
}