import 'reflect-metadata'
import { Field, ObjectType, registerEnumType } from "@nestjs/graphql"
import { Estado } from '@prisma/client';

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

    @Field(() => Boolean)
    personalizado: boolean

}