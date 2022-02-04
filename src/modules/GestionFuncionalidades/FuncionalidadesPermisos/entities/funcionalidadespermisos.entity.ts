import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Permisos } from "../../Permisos/entities/permisos.entity"
import { Funcionalidades } from "../../Funcionalidades/entities/funcionalidades.entity"

@ObjectType()
export class FuncionalidadesPermisos {
    @Field((type) => ID)
    funcionalidad_permiso_id: number

    @Field((type) => Funcionalidades)
    Funcionalidades: Funcionalidades

    @Field((type) => Permisos)
    Permisos: Permisos
}