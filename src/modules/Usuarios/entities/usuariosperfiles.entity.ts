import 'reflect-metadata'
import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class UsuariosPerfiles {

    @Field(() => Int)
    perfil_usuario_id: number 

    @Field(() => Number)
    usuario_id: number

    @Field(() => Number)
    perfil_id: number

}