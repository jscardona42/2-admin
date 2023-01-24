import 'reflect-metadata'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import JSON from 'graphql-type-json';
import { CreateUsuarioPerfilInput, UpdateUsuarioPerfilInput } from './usuariosperfiles.dto';
import { UpdateUsuarioParametroValorInput } from '../../../modules/UsuariosParametrosValores/dto/usuariosparametrosvalores.dto';

@InputType()
export class CreateUsuarioInput {

    @Field(() => String)
    @IsNotEmpty()
    nombre_usuario: string

    @Field(() => String)
    @IsNotEmpty()
    correo: string

    @Field(() => String, { nullable: true })
    imagen?: string

    @Field(() => Number)
    @IsNotEmpty()
    estado_usuario_id: number

    @Field(() => Number)
    @IsNotEmpty()
    tipo_usuario_id: number

    @Field(() => Number, { nullable: true })
    metodo_autenticacion_id?: number

    @Field(() => [CreateUsuarioPerfilInput])
    UsuariosPerfiles: CreateUsuarioPerfilInput[]
}

@InputType()
export class UpdateUsuarioInput {

    @Field(() => Int)
    @IsNotEmpty()
    usuario_id: number

    @Field(() => String, { nullable: true })
    nombre_usuario?: string

    @Field(() => String, { nullable: true })
    correo?: string

    @Field(() => String, { nullable: true })
    imagen?: string

    @Field(() => Number, { nullable: true })
    idioma_id?: number

    @Field(() => Number, { nullable: true })
    estado_usuario_id?: number

    @Field(() => Number, { nullable: true })
    tipo_usuario_id?: number

    @Field(() => Number, { nullable: true })
    metodo_autenticacion_id?: number

    @Field(() => [UpdateUsuarioPerfilInput], { nullable: true })
    UsuariosPerfiles?: UpdateUsuarioPerfilInput[]

    @Field(() => [UpdateUsuarioParametroValorInput], { nullable: true })
    UsuariosParametrosValores?: UpdateUsuarioParametroValorInput[]
}

@InputType()
export class SignInUserInput {
    @Field(() => String)
    @IsNotEmpty()
    nombre_usuario: string

    @Field(() => String)
    @IsNotEmpty()
    contrasena: string
}

@InputType()
export class ChangePasswordInput {
    @Field(() => Number)
    @IsNotEmpty()
    usuario_id: number

    @Field(() => String, { nullable: true })
    contrasena?: string

    @Field(() => String)
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