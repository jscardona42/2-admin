import 'reflect-metadata'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@InputType()
export class CreateUsuarioPerfilInput {

    @Field(() => Number)
    @IsNotEmpty()
    perfil_id: number

}
