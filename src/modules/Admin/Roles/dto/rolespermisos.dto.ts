import 'reflect-metadata'
import { Field, InputType, PartialType, } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'


@InputType()
export class CreateRolPermisoInput {
    @Field()
    @IsNotEmpty()
    permiso_id: number
}

@InputType()
export class UpdateRolPermisoInput extends PartialType(CreateRolPermisoInput) {
    @Field()
    @IsNotEmpty()
    rol_permiso_id: number

}
