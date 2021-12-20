import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Entidades } from "../../../Admin/Entidades/entities/entidades.entity"
import { PermisosValidaciones } from "../../Validaciones/entities/permisosvalidaciones.entity"

@ObjectType()
export class Permisos {
    @Field((type) => ID)
    permiso_id: number

    @Field((type) => Entidades)
    Entidades: Entidades

    @Field((type) => String)
    permiso: string

    @Field((type) => Boolean)
    es_publico: boolean

    @Field((type) => [PermisosValidaciones], { nullable: true })
    PermisosValidacionesSec?: PermisosValidaciones[]

}