import 'reflect-metadata';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ObjectType()
export class Traducciones {
    @Field(type => ID)
    @IsNotEmpty()
    traduccion_id: number

    @Field()
    @IsNotEmpty()
    idioma: string

    @Field()
    @IsNotEmpty()
    sigla: string
}
