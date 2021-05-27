import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class Permisos {
    @Field((type) => ID)
    permiso_id: number

    @Field((type) => Number)
    entidad_id?: number

    @Field((type) => String)
    permiso?: string

    @Field((type) => Boolean)
    es_publico?: boolean

}