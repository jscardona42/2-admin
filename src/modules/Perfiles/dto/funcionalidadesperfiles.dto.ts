import 'reflect-metadata'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@InputType()
export class CreateFuncionalidadPerfilInput {

    @Field(() => Number)
    @IsNotEmpty()
    funcionalidad_id: number

}