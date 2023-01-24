import 'reflect-metadata'
import { ObjectType, Field } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { TbEstadosUsuarios } from '../EstadosUsuarios/entities/tbestadosusuarios.entity'
import { TbMetodosAutenticacion } from '../../MetodosAutenticacion/entities/tbmetodosautenticacion.entity'
import { TbTipoUsuarios } from '../TipoUsuarios/entities/tipousuarios.entity'
import { UsuariosPerfiles } from '../../../modules/Perfiles/entities/usuariosperfiles.entity'
import { UsuariosSesiones } from '../../UsuariosSesiones/entities/usuariosesiones.entity'
import { UsuariosHistoricoContrasenas } from '../../../modules/UsuariosHistoricoContrasenas/entities/usuariohistoricocontrasenas.entity'
import { UsuariosParametrosValores } from '../../../modules/UsuariosParametrosValores/entities/usuariosparametrosvalores.entity'

@ObjectType()
export class Usuarios {

    @Field(() => Number)
    usuario_id: number

    @Field(() => String)
    @IsNotEmpty()
    nombre_usuario: string

    @Field(() => String)
    @IsNotEmpty()
    contrasena: string

    @Field(() => String)
    @IsNotEmpty()
    @IsEmail()
    correo: string

    @Field(() => String)
    salt: string

    @Field(() => Number)
    idioma_id?: number

    @Field(() => Boolean)
    sol_cambio_contrasena?: boolean

    @Field(() => Date)
    fecha_vigencia_contrasena?: Date

    @Field(() => Date)
    fecha_creacion?: Date

    @Field(() => String)
    fecha_actualizacion?: string

    @Field(() => String)
    imagen?: string

    @Field(() => Number)
    cant_intentos: number

    @Field(() => TbEstadosUsuarios)
    TbEstadosUsuarios: TbEstadosUsuarios

    @Field(() => TbMetodosAutenticacion, { nullable: true })
    TbMetodosAutenticacion?: TbMetodosAutenticacion

    @Field(() => TbTipoUsuarios)
    TbTipoUsuarios: TbTipoUsuarios

    @Field(() => UsuariosSesiones, { nullable: true })
    UsuariosSesionesSec?: UsuariosSesiones

    @Field(() => [UsuariosHistoricoContrasenas], { nullable: true })
    UsuariosHistoricoContrasenasSec?: UsuariosHistoricoContrasenas[]

    @Field(() => String, { nullable: true })
    config_totp?: string

    @Field(() => String, { nullable: true })
    cod_recuperacion?: string

    @Field(() => String, { nullable: true })
    qr_code?: string

    @Field(() => [UsuariosPerfiles], { nullable: true })
    UsuariosPerfiles?: UsuariosPerfiles[]

    @Field(() => [UsuariosParametrosValores], { nullable: true })
    UsuariosParametrosValores?: UsuariosParametrosValores[]
}
