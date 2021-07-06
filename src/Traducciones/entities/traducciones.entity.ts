import 'reflect-metadata';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import JSON from 'graphql-type-json';
import { MenusPalabras } from 'src/MenusPalabras/entities/menuspalabras.entity';
import { IsNotEmpty } from 'class-validator';

@ObjectType()
export class Traducciones {
    @Field(type => ID)
    @IsNotEmpty()
    traduccion_id: number

    @Field()
    @IsNotEmpty()
    idioma: string
}
