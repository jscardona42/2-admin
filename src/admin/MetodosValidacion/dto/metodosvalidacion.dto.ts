import 'reflect-metadata'
import { Field, InputType, PartialType, } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'


@InputType()
export class CreateMetodoValidacionInput {

    @Field((type) => String)
    metodo: string

    @Field((type) => Boolean, { nullable: true })
    activo?: boolean
}

@InputType()
export class UpdateMetodoValidacionInput extends PartialType(CreateMetodoValidacionInput) {
    @Field((type) => Number)
    @IsNotEmpty()
    metodo_validacion_id

}
