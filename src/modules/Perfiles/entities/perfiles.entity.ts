import 'reflect-metadata'
import { Field, ObjectType, registerEnumType } from "@nestjs/graphql"
import { FormulariosPerfiles } from './formulariosperfiles.entity';
import { FuncionalidadesPerfiles } from '../../../modules/FuncionalidadesPerfiles/entities/funcionalidadesperfiles.entity';
import { EstadoPerfil } from '@prisma/client';

registerEnumType(EstadoPerfil, {
    name: 'EstadoPerfil',
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

    @Field(() => EstadoPerfil)
    estado: EstadoPerfil

    @Field(() => String)
    codigo: string

    @Field(() => [FormulariosPerfiles], { nullable: true })
    FormulariosPerfilesSec?: FormulariosPerfiles[]

    @Field(() => [FuncionalidadesPerfiles], { nullable: true })
    FuncionalidadesPerfilesSec?: FuncionalidadesPerfiles[]

}