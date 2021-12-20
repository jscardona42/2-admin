import 'reflect-metadata'
import { Field, InputType, PartialType, } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { CreateMenuPalabrasInput } from '../../MenusPalabras/dto/menuspalabras.dto'
import { CreateMenuTraduccionInput } from '../../MenusTraducciones/dto/menustraducciones.dto'


@InputType()
export class CreateMenuInput {
    @Field()
    @IsNotEmpty()
    parentId: number

    @Field()
    @IsNotEmpty()
    name: string

    @Field((type) => Number, { nullable: true })
    entidad_id?: number

    @Field((type) => Number, { nullable: true })
    order?: number

    @Field((type) => String, { nullable: true })
    icon?: string

    @Field((type) => Boolean, { nullable: true })
    base?: boolean

    @Field((type) => [CreateMenuPalabrasInput], { nullable: true })
    MenusPalabras?: CreateMenuPalabrasInput[]

    @Field((type) => [CreateMenuTraduccionInput], { nullable: true })
    MenusTraducciones?: CreateMenuTraduccionInput[]
}

@InputType()
export class UpdateMenuInput extends PartialType(CreateMenuInput) {
    @Field()
    @IsNotEmpty()
    menu_id: number

}
