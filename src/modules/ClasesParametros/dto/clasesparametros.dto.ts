import 'reflect-metadata'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateClasesParametrosInput {

    @Field(() => String)
    nombre: string

}
