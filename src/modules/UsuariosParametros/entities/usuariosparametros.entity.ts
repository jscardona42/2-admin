import 'reflect-metadata'
import { Field, ObjectType } from "@nestjs/graphql"
import { TbClasesParametros } from '../../ClasesParametros/entities/tbclasesparametros.entity'

@ObjectType()
export class UsuariosParametros {

    @Field(() => Number)
    usuario_parametro_id: number 

    @Field(() => Number)
    clase_parametro_id: number

    @Field(() => String)
    nombre: string

    @Field(() => String)
    alias: string

    @Field(() => String)
    descripcion: string

    @Field(() => String)
    valor_defecto?: string

    @Field(() => Boolean)
    requerido?: boolean

    @Field(() => TbClasesParametros)
    TbClasesParametros: TbClasesParametros
}