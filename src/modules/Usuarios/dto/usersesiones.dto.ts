import 'reflect-metadata'
import { Field, InputType, Int, PartialType, } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@InputType()
export class CreateUserSesion {

    @Field((type) => String)
    token: string

}
