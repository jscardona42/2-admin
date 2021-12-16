import 'reflect-metadata';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Auditorias {
    @Field(type => ID)
    auditoria_id: number

    @Field(type => String, {nullable: true})
    usuario_id?: number

    @Field(type => String, {nullable: true})
    status?: string 

    @Field(type => Date, {nullable: true})
    fecha_creacion?: Date

    @Field(type => String, {nullable: true})
    tipo?: string

    @Field(type => String, {nullable: true})
    username?: string

    @Field(type => String, {nullable: true})
    rol?: string

    @Field(type => Boolean, {nullable: true})
    tiene_doble_factor?: boolean
}