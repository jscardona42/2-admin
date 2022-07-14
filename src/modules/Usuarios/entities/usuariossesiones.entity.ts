import 'reflect-metadata'
import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class UsuariosSesionesSec {

    @Field(() => String, { nullable: true })
    token?: string | null
}