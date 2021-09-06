import 'reflect-metadata'
import { Field, InputType, PartialType, } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'


@InputType()
export class CreateEntidadInput {

    @Field((type) => String)
    nombre: string

    @Field((type) => String)
    resolver: string

}

@InputType()
export class UpdateEntidadInput extends PartialType(CreateEntidadInput) {
    @Field()
    @IsNotEmpty()
    entidad_id: number

}
