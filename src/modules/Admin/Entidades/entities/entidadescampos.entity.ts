import { Field, Int, ObjectType } from "@nestjs/graphql"
import { Entidades } from "./entidades.entity"

@ObjectType()
export class EntidadesCampos {
    @Field(() => Int)
    entidad_campo_id: number

    @Field(() => String)
    nombre: string

    @Field(() => String)
    tipo: string

    @Field(() => Entidades)
    Entidades: Entidades
}