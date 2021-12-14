import 'reflect-metadata'
import { Field, InputType, PartialType, } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { CreateRolPermisoInput, UpdateRolPermisoInput } from './rolespermisos.dto'


@InputType()
export class CreateRolInput {

    @Field()
    @IsNotEmpty()
    rol: string

    @Field(() => [CreateRolPermisoInput], { nullable: true })
    RolesPermisos?: CreateRolPermisoInput[]
}

@InputType()
export class UpdateRolInput {
    @Field()
    @IsNotEmpty()
    rol_id: number

    @Field({ nullable: true })
    rol?: string

    @Field(() => UpdateRolPermisoInput, { nullable: true })
    RolesPermisos?: UpdateRolPermisoInput

}

@InputType()
export class AddPermisosToRolInput {
    @Field()
    @IsNotEmpty()
    rol_id: number

    @Field(() => [CreateRolPermisoInput], { nullable: true })
    RolesPermisos?: CreateRolPermisoInput[]
}
