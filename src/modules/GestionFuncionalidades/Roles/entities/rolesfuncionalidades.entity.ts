import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Funcionalidades } from "../../Funcionalidades/entities/funcionalidades.entity"
import { TbRoles } from "./tbroles.entity"

@ObjectType()
export class RolesFuncionalidades {

    @Field(() => Number)
    rol_funcionalidad_id: number

    @Field(() => Number)
    funcionalidad_id: number

    @Field(() => Number)
    rol_id: number

    @Field(() => TbRoles)
    TbRoles: TbRoles

    @Field(() => Funcionalidades)
    Funcionalidades: Funcionalidades
}