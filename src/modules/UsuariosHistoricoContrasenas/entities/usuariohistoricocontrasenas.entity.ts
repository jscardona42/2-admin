import 'reflect-metadata'
import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class UsuariosHistoricoContrasenas {

    @Field(() => Int)
    usu_historico_contrasena_id: number 

    @Field(() => Number)
    usuario_id: number

    @Field(() => String, { nullable: true })
    contrasena?: string

    @Field(() => Date, { nullable: true })
    fecha_actualizacion?: Date

}