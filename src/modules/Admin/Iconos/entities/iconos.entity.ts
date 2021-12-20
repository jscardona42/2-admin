import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class Iconos {
    @Field((type) => ID)
    icono_id: number

    @Field((type) => String)
    nombre: string

    @Field((type) => Boolean, { nullable: true })
    activo?: boolean

    @Field((type) => String)
    unicode: string

}