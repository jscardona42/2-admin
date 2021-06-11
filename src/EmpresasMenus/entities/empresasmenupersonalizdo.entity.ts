import 'reflect-metadata';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import JSON from 'graphql-type-json';

@ObjectType()
export class EmpresasMenuPersonalizado {
    @Field(type => ID)
    menu_pesonalizado_id: number

    @Field(type => Number)
    empresa_id: number

    @Field(type => JSON)
    menu: [JSON]
}