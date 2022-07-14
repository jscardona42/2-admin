import 'reflect-metadata'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { CreateUserSesion } from './usersesiones.dto'

@InputType()
export class SignUpUserInput {
    
    @Field(() => Boolean)
    conexion_externa?: boolean

    @Field(() => String)
    @IsNotEmpty()
    nombre: string

    @Field(() => String)
    @IsNotEmpty()
    email: string

    @Field(() => String)
    @IsNotEmpty()
    username: string

    @Field(() => String)
    @IsNotEmpty()
    password: string

    @Field(() => Int)
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


