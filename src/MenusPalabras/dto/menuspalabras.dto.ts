import 'reflect-metadata'
import { Field, InputType, PartialType, } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'


@InputType()
export class CreateMenuPalabrasInput {
    @Field()
    @IsNotEmpty()
    menu_id: number

    @Field()
    @IsNotEmpty()
    palabra: string
}

@InputType()
export class UpdateMenuPalabrasInput extends PartialType(CreateMenuPalabrasInput) {
    @Field()
    @IsNotEmpty()
    menu_palabra_id: number

}
