import { Field, Int, ObjectType } from "@nestjs/graphql"
import { EntidadesSecundariasCampos } from "./entidadessecundariascampos.entity"

@ObjectType()
export class EntidadesSecundarias {
    @Field(() => Int)
    entidad_secundaria_id: number

    @Field(() => String)
    nombre: string

    @Field(() => [EntidadesSecundariasCampos])
    EntidadesSecundariasCamposSec: EntidadesSecundariasCampos[]
}