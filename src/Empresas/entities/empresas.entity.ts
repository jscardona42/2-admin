import 'reflect-metadata';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Empresas {
    @Field(type => ID)
    empresa_id: number

    @Field()
    nombre: string
}