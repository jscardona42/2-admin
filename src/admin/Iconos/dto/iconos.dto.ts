import 'reflect-metadata'
import { Field, InputType, PartialType, } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'


@InputType()
export class CreateIconoInput {

    @Field((type) => String)
    nombre: string

    @Field((type) => String, { nullable: true })
    activo?: string

}

@InputType()
export class UpdateIconoInput extends PartialType(CreateIconoInput) {
    @Field()
    @IsNotEmpty()
    icono_id: number

}
