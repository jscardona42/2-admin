import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class MetodosValidacion {
    @Field((type) => ID)
    metodo_validacion_id: number

    @Field((type) => String)
    metodo: string

    @Field((type) => Boolean)
    activo?: boolean
}