import 'reflect-metadata'
import { Field, InputType, PartialType, } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'


@InputType()
export class CreateIconoInput {

    @Field((type) => String)
    nombre: string

    @Field((type) => Boolean, { nullable: true })
    activo?: boolean

    @Field((type) => String)
    unicode: string

}

@InputType()
export class UpdateIconoInput extends PartialType(CreateIconoInput) {
    @Field((type) => Number)
    @IsNotEmpty()
    icono_id: number

}
