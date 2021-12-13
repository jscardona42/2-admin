import 'reflect-metadata'
import { Field, InputType, PartialType, } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'


@InputType()
export class CreateValidacionInput {

    @Field((type) => Number)
    microservicio_id: number

    @Field((type) => String)
    id_referenciado: string

}

@InputType()
export class UpdateValidacionInput extends PartialType(CreateValidacionInput) {
    @Field()
    @IsNotEmpty()
    validacion_id: number

}
