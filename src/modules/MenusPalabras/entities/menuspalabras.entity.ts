import 'reflect-metadata';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class MenusPalabras {
    @Field(type => ID)
    menu_palabra_id: number

    @Field(type => Number)
    menu_id: number

    @Field()
    palabra: string
}
