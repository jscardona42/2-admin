import 'reflect-metadata'
import { Field, InputType, PartialType, } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import JSON from 'graphql-type-json';


@InputType()
export class UpdateMenuPersonalizadoInput {

    @Field((type) => Number)
    @IsNotEmpty()
    empresa_id?: number

    @Field((type) => JSON)
    menu: JSON
}
