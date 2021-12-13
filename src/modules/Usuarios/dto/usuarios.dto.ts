import 'reflect-metadata'
import { Field, InputType, PartialType, } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty } from 'class-validator'


@InputType()
export class CreateUsuarioInput {

    @Field()
    @IsNotEmpty()
    nombre: string

    @Field()
    @IsNotEmpty()
    @IsEmail()
    email: string
}


@InputType()
export class UpdateUsuarioInput extends PartialType(CreateUsuarioInput) {

    @Field((type) => Number)
    usuario_id: number
}


