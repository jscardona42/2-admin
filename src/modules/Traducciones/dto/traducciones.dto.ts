import 'reflect-metadata'
import { Field, InputType, PartialType, } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'


@InputType()
export class CreateTraduccionesInput {

    @Field()
    @IsNotEmpty()
    idioma: string

    @Field()
    @IsNotEmpty()
    sigla: string
}

@InputType()
export class UpdateTraduccionesInput extends PartialType(CreateTraduccionesInput) {
    
    @Field()
    @IsNotEmpty()
    traduccion_id: number

}
