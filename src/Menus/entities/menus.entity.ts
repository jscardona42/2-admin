import 'reflect-metadata';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import JSON from 'graphql-type-json';
import { MenusPalabras } from '../../MenusPalabras/entities/menuspalabras.entity';
import { IsNotEmpty } from 'class-validator';
import { MenusTraducciones } from '../../Traducciones/entities/menustraducciones.entity';

@ObjectType()
export class Menus {
    @Field(type => ID)
    menu_id: number

    @Field()
    @IsNotEmpty()
    title: string

    @Field()
    @IsNotEmpty()
    path: string

    @Field(type => Number, { nullable: true })
    entidad_id?: number

    @Field()
    @IsNotEmpty()
    isEntity: boolean

    @Field(type => JSON)
    other_Menus: [JSON]

    @Field(type => Number, { nullable: true })
    order?: number

    @Field(type => [MenusPalabras], { nullable: true })
    MenusPalabras?: MenusPalabras[]

    @Field(type => [MenusTraducciones], { nullable: true })
    MenusTraducciones?: MenusTraducciones[]

}
