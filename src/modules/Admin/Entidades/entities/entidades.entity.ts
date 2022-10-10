import { Field, Int, ObjectType } from "@nestjs/graphql"
import { Permisos } from "../../../GestionFuncionalidades/Permisos/entities/permisos.entity"
import { EntidadesCampos } from "./entidadescampos.entity"
import { EntidadesSecundarias } from "./entidadessecundarias.entity"

@ObjectType()
export class Entidades {
    @Field(() => Int)
    entidad_id: number

    @Field(() => String)
    nombre: string

    @Field(() => String, { nullable: true })
    resolver?: string

    @Field(() => [EntidadesSecundarias])
    EntidadesSecundariasSec: EntidadesSecundarias[]

    @Field(() => [EntidadesCampos])
    EntidadesCamposSec: EntidadesCampos[]

    @Field(() => [Permisos])
    Permisos: Permisos[]

    @Field(() => [EntidadesCampos], { nullable: true })
    EntidadesRelacionadas?: EntidadesCampos[]
}