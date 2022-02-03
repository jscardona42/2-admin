import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Funcionalidades } from "../../Funcionalidades/entities/funcionalidades.entity"
import { Roles } from "./roles.entity"

@ObjectType()
export class RolesFuncionalidades {
    @Field((type) => ID)
    rol_funcionalidad_id: number

    @Field((type) => Roles)
    Roles: Roles

    @Field((type) => Funcionalidades)
    Funcionalidades: Funcionalidades
}