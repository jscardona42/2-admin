import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class EntidadesSecundariasCampos {
    @Field(() => Int)
    entidad_secundaria_campo_id: number

    @Field(() => String)
    nombre: string

    @Field(() => String)
    tipo: string
}