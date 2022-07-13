import 'reflect-metadata'
import { Field, ID, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class UsuariosSesionesSec {

    @Field((type) => String, { nullable: true })
    token?: string | null
}