import 'reflect-metadata';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import JSON from 'graphql-type-json';

@ObjectType()
export class Menu {
    @Field(type => ID)
    menu_id: number

    @Field()
    title: string

    @Field()
    path: string 

    @Field()
    isEntity: boolean

    @Field(type => JSON)
    subMenu: [JSON]

}