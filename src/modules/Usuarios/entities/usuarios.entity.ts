import 'reflect-metadata'
import { ObjectType, Field, ID} from '@nestjs/graphql'
import { IsEmail, IsNotEmpty } from 'class-validator'

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

    // @Field((type) => Number, { nullable: true })
    // empresa_id?: number | null
}
