import 'reflect-metadata'
import { Field, ObjectType, registerEnumType } from "@nestjs/graphql"
import { Estado } from '@prisma/client';
import { FormulariosPerfiles } from './formulariosperfiles.entity';
import { FuncionalidadesPerfiles } from 'src/modules/FuncionalidadesPerfiles/entities/funcionalidadesperfiles.entity';

registerEnumType(Estado, {
    name: 'Estado',
});

@ObjectType()
export class Perfiles {

    @Field(() => Number)
    perfil_id: number

    @Field(() => String)
    nombre: string

    @Field(() => String, { nullable: true })
    descripcion?: string

    @Field(() => Boolean, { nullable: true })
    personalizado?: boolean

    @Field(() => Boolean)
    estado: boolean

    @Field(() => String)
    codigo: string

    @Field(() => [FormulariosPerfiles], { nullable: true })
    FormulariosPerfilesSec?: FormulariosPerfiles[]

    @Field(() => [FuncionalidadesPerfiles], { nullable: true })
    FuncionalidadesPerfilesSec?: FuncionalidadesPerfiles[]

}