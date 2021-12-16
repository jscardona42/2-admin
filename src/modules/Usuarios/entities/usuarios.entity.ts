import 'reflect-metadata'
import { ObjectType, Field, ID } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { DoblesFactores } from '../../../modules/DoblesFactores/entities/doblesfactores.entity'

@ObjectType()
export class Usuarios {
    @Field((type) => ID)
    usuario_id: number

    @Field()
    @IsNotEmpty()
    nombre: string

    @Field()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @Field((type) => Boolean, { nullable: true })
    activo?: boolean | null

    @Field()
    @IsNotEmpty()
    username: string

    @Field()
    @IsNotEmpty()
    password: string

    @Field((type) => String, { nullable: true })
    token?: string | null

    @Field((type) => String, { nullable: true })
    salt?: string | null

    @Field((type) => Number)
    rol_id?: number

    @Field((type) => Boolean, { nullable: true })
    tiene_doble_factor?: boolean | null

    @Field((type) => [DoblesFactores], { nullable: true })
    DoblesFactores?: DoblesFactores[]
}
