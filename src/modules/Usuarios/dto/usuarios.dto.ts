import 'reflect-metadata'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@InputType()
export class SignUpUserInput {
    
    @Field(() => String)
    @IsNotEmpty()
    nombre_usuario: string

    @Field(() => String)
    @IsNotEmpty()
    correo: string

    @Field(() => Int)
    rol_id: number

    @Field(() => Number)
    @IsNotEmpty()
    estado_usuario_id: number

    @Field(() => Number)
    @IsNotEmpty()
    tipo_usuario_id: number

    @Field(() => Number)
    @IsNotEmpty()
    metodo_autenticacion_id: number
}

@InputType()
export class SignInUserInput {
    @Field()
    nombre_usuario: string

    @Field()
    contrasena: string
}

@InputType()
export class ChangePasswordInput {
    @Field()
    @IsNotEmpty()
    usuario_id: number

    @Field({nullable: true})
    contrasena?: string

    @Field()
    @IsNotEmpty()
    nueva_contrasena: string

    @Field()
    @IsNotEmpty()
    tipo_solicitud: number
}

@InputType()
export class SendCodeVerificationInput {

    @Field(() => String)
    @IsNotEmpty()
    nombre_usuario: string
}

@InputType()
export class ValidationCodeVerificationInput {

    @Field(() => String)
    @IsNotEmpty()
    codigo: string

    @Field(() => String)
    @IsNotEmpty()
    nombre_usuario: string
}