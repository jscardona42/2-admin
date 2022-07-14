import 'reflect-metadata'
import { ObjectType, Field, ID } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { DoblesFactores } from '../../../modules/DoblesFactores/entities/doblesfactores.entity'
import { UsuariosSesionesSec } from './usuariossesiones.entity'

@ObjectType()
export class Usuarios {
    @Field(() => ID)
    usuario_id: number

    @Field()
    @IsNotEmpty()
    nombre: string

    @Field()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @Field(() => Boolean, { nullable: true })
    activo?: boolean | null

    @Field(() => Boolean, { nullable: true })
    conexion_externa?: boolean | null

    @Field()
    @IsNotEmpty()
    username: string

    @Field()
    @IsNotEmpty()
    password: string

    @Field(() => String, { nullable: true })
    salt?: string | null

    @Field(() => Number)
    rol_id?: number

    @Field(() => Boolean, { nullable: true })
    tiene_doble_factor?: boolean | null

    @Field(() => [DoblesFactores], { nullable: true })
    DoblesFactores?: DoblesFactores[]

    @Field(() => UsuariosSesionesSec)
    UsuariosSesionesSec?: UsuariosSesionesSec
}
