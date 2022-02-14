import 'reflect-metadata'
import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { CreateFuncionalidadPermisosInput, UpdateFuncionalidadPermisosInput } from '../../FuncionalidadesPermisos/dto/funcionalidadespermisos.dto'


@InputType()
export class CreateFuncionalidadInput {
    @Field((type) => String)
    nombre: string

    @Field((type) => Number)
    entidad_id: number

    @Field((type) => [CreateFuncionalidadPermisosInput])
    FuncionalidadesPermisos: CreateFuncionalidadPermisosInput[]
}

@InputType()
export class UpdateFuncionalidadInput {
    @Field()
    @IsNotEmpty()
    funcionalidad_id: number

    @Field((type) => String, { nullable: true })
    nombre?: string

    @Field((type) => [UpdateFuncionalidadPermisosInput])
    FuncionalidadesPermisos: UpdateFuncionalidadPermisosInput[]
}

@InputType()
export class FilterFuncionalidadesInput {

    @Field({ nullable: true })
    nombre?: string

    @Field({ nullable: true })
    entidad_nombre?: string

    @Field({ nullable: true })
    entidad_id?: number
}

@InputType()
export class AddPermisosToFuncionalidadInput {
    @Field()
    @IsNotEmpty()
    funcionalidad_id: number

    @Field(() => [CreateFuncionalidadPermisosInput])
    FuncionalidadesPermisos: CreateFuncionalidadPermisosInput[]
}

