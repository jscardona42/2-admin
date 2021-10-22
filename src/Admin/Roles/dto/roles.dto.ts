import 'reflect-metadata'
import { Field, InputType, PartialType, } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'


@InputType()
export class CreateRolInput {

    @Field()
    @IsNotEmpty()
    rol: string
}

@InputType()
export class UpdateRolInput extends PartialType(CreateRolInput) {
    @Field()
    @IsNotEmpty()
    rol_id: number

}
