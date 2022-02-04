import 'reflect-metadata'
import { Field, InputType, PartialType, } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'


@InputType()
export class CreateRolFuncionalidadInput {
    @Field()
    @IsNotEmpty()
    funcionalidad_id: number
}

@InputType()
export class UpdateRolFuncionalidadInput extends PartialType(CreateRolFuncionalidadInput) {
    @Field()
    @IsNotEmpty()
    rol_funcionalidad_id: number
}
