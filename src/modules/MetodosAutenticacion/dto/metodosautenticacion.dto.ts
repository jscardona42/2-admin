import 'reflect-metadata'
import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'


@InputType()
export class CreateMetodoAutenticacionInput {

    @Field(() => String)
    @IsNotEmpty()
    nombre: string

}

@InputType()
export class UpdateMetodoAutenticacionInput {

    @Field(() => Number)
    @IsNotEmpty()
    metodo_autenticacion_id: number 

    @Field(() => String, {nullable: true})
    nombre?: string

}

@InputType()
export class FilterMetodosAutenticacionInput {

    @Field(() => String, {nullable: true})
    nombre?: string 

}