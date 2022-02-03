import 'reflect-metadata'
import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { CreateRolFuncionalidadInput, UpdateRolFuncionalidadInput } from './rolesfuncionalidades.dto'


@InputType()
export class CreateRolInput {
    @Field()
    @IsNotEmpty()
    rol: string

    @Field(() => [CreateRolFuncionalidadInput], { nullable: true })
    RolesFuncionalidades?: CreateRolFuncionalidadInput[]
}

@InputType()
export class UpdateRolInput {
    @Field()
    @IsNotEmpty()
    rol_id: number

    @Field({ nullable: true })
    rol?: string

    @Field(() => [UpdateRolFuncionalidadInput], { nullable: true })
    RolesFuncionalidades?: UpdateRolFuncionalidadInput[]
}

@InputType()
export class AddFuncionalidadesToRolInput {
    @Field()
    @IsNotEmpty()
    rol_id: number

    @Field(() => [CreateRolFuncionalidadInput], { nullable: true })
    RolesFuncionalidades?: CreateRolFuncionalidadInput[]
}
