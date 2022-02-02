import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Entidades } from "../../../Admin/Entidades/entities/entidades.entity"
import { FuncionalidadesPermisos } from "../../FuncionalidadesPermisos/entities/funcionalidadespermisos.entity"

@ObjectType()
export class Funcionalidades {
    @Field((type) => ID)
    funcionalidad_id: number

    @Field((type) => String)
    nombre: string

    @Field((type) => Entidades)
    Entidades: Entidades

    @Field((type) => [FuncionalidadesPermisos])
    FuncionalidadesPermisosSec: FuncionalidadesPermisos[]
}