import 'reflect-metadata'
import { Field, InputType, PartialType, } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'


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

}

@InputType()
export class UpdateMenuInput extends PartialType(CreateMenuInput) {
    @Field()
    @IsNotEmpty()
    menu_id: number

}
