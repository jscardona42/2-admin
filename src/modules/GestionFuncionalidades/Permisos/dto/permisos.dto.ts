import 'reflect-metadata'
import { Field, InputType, PartialType, } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'


@InputType()
export class CreatePermisoInput {

    @Field((type) => Number)
    entidad_id: number

    @Field((type) => String)
    permiso: string

    @Field((type) => Boolean)
    es_publico: boolean

}

@InputType()
export class UpdatePermisoInput extends PartialType(CreatePermisoInput) {
    @Field()
    @IsNotEmpty()
    permiso_id: number
}
