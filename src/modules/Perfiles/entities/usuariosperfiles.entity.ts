import 'reflect-metadata'
import { Field, ObjectType } from "@nestjs/graphql"
import { Perfiles } from './perfiles.entity'
import { Usuarios } from '../../../modules/Usuarios/entities/usuarios.entity'


@ObjectType()
export class UsuariosPerfiles {

    @Field(() => Number)
    usuario_perfil_id: number

    @Field(() => Perfiles)
    Perfiles: Perfiles

    @Field(() => Usuarios)
    Usuarios: Usuarios
}