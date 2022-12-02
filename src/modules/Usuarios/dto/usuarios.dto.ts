import 'reflect-metadata'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import JSON from 'graphql-type-json';

@InputType()
export class SignUpUserInput {

    @Field(() => String)
    @IsNotEmpty()
    nombre_usuario: string

    @Field(() => String)
    @IsNotEmpty()
    correo: string

    @Field(() => Number)
    @IsNotEmpty()
    estado_usuario_id: number

    @Field(() => Number)
    @IsNotEmpty()
    tipo_usuario_id: number

    @Field(() => Number, { nullable: true })
    metodo_autenticacion_id?: number
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

    @Field({ nullable: true })
    contrasena?: string

    @Field()
    @IsNotEmpty()
    nueva_contrasena: string
}

@InputType()
export class SendCodeVerificationInput {

    @Field(() => String)
    @IsNotEmpty()
    nombre_usuario: string

    @Field(() => String, { nullable: true })
    tipo_solicitud?: string
}

@InputType()
export class ValidationCodeVerificationInput {

    @Field(() => String)
    @IsNotEmpty()
    codigo: string

    @Field(() => Number)
    @IsNotEmpty()
    usuario_id: number
}

@InputType()
export class ValidationCodeMailInput {

    @Field(() => String)
    @IsNotEmpty()
    codigo: string

    @Field(() => Number)
    @IsNotEmpty()
    usuario_id: number
}

@InputType()
export class ValidationCodeTotpInput {

    @Field(() => String)
    @IsNotEmpty()
    codigo_acceso: string

    @Field(() => Number)
    @IsNotEmpty()
    usuario_id: number
}

@InputType()
export class ValidationRecoveryCodeInput {

    @Field(() => String)
    @IsNotEmpty()
    codigo_recuperacion: string

    @Field(() => Number)
    @IsNotEmpty()
    usuario_id: number
}

@InputType()
export class MessageInput {

    @Field(() => Number)
    @IsNotEmpty()
    proveedor_mensajeria_id: number

    @Field(() => JSON)
    @IsNotEmpty()
    usuarios: JSON

    @Field(() => JSON, { nullable: true })
    params?: JSON

    @Field(() => String, { nullable: true })
    nombre?: string
}

@InputType()
export class MessageArrayInput {

    @Field(() => [MessageInput])
    data: MessageInput[]
}