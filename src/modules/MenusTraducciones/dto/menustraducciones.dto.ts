import 'reflect-metadata'
import { Field, InputType, PartialType, } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'


@InputType()
export class CreateMenuTraduccionInput {

    @Field()
    @IsNotEmpty()
    traduccion: string

    @Field(type => Number)
    menu_id: number

    @Field()
    @IsNotEmpty()
    traduccion_id: number
}

@InputType()
export class UpdateMenuTraduccionInput extends PartialType(CreateMenuTraduccionInput) {
    @Field()
    @IsNotEmpty()
    menu_traduccion_id: number

}

@InputType()
export class CreateMenuTraduccionMany {
    @Field((type) => [CreateMenuTraduccionInput])
    @IsNotEmpty()
    data: CreateMenuTraduccionInput[]

}
