import 'reflect-metadata'
import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@InputType()
export class SignUpUserInput {
    @Field()
    @IsNotEmpty()
    nombre: string

    @Field()
    @IsNotEmpty()
    email: string

    @Field()
    @IsNotEmpty()
    username: string

    @Field()
    @IsNotEmpty()
    password: string

    @Field()
    rol_id: number
}

@InputType()
export class SignInUserInput {
    @Field()
    username: string

    @Field()
    password: string
}

@InputType()
export class ChangePasswordInput {
    @Field()
    @IsNotEmpty()
    usuario_id: number

    @Field()
    @IsNotEmpty()
    password: string

    @Field()
    @IsNotEmpty()
    new_password: string
}


