import 'reflect-metadata'
import { ObjectType, Field, ID } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@ObjectType()
export class Microservicios {
    @Field((type) => ID)
    microservicio_id: number

    @Field((type) => String)
    @IsNotEmpty()
    name: string

    @Field((type) => String)
    @IsNotEmpty()
    hostname: string

    @Field((type) => Number)
    @IsNotEmpty()
    puerto: number

    @Field((type) => String)
    @IsNotEmpty()
    url: string

    @Field((type) => Boolean, { nullable: true })
    activo: boolean
}