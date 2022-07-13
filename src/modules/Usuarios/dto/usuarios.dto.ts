import 'reflect-metadata'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { CreateUserSesion } from './usersesiones.dto'

@InputType()
export class SignUpUserInput {
    
    @Field((type) => Boolean)
    conexion_externa?: boolean

    @Field((type) => String)
    @IsNotEmpty()
    nombre: string

    @Field((type) => String)
    @IsNotEmpty()
    email: string

    @Field((type) => String)
    @IsNotEmpty()
    username: string

    @Field((type) => String)
    @IsNotEmpty()
    password: string

    @Field((type) => Int)
    rol_id: number

    // @Field((type) => [CreateUserSesion])
    // CreateUserSesion: CreateUserSesion[]
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


