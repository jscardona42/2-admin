import 'reflect-metadata';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ObjectType()
export class MenusTraducciones {
    @Field(type => ID)
    @IsNotEmpty()
    menu_traduccion_id: number

    @Field()
    @IsNotEmpty()
    traduccion: string

    @Field()
    @IsNotEmpty()
    menu_id: number

    @Field()
    @IsNotEmpty()
    traduccion_id: number
}
