import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateFuncionalidadPermisosInput {
    @Field((type) => Number)
    permiso_id: number
}

@InputType()
export class UpdateFuncionalidadPermisosInput {
    @Field((type) => Number)
    funcionalidad_permiso_id: number

    @Field((type) => Number, { nullable: true })
    permiso_id?: number
}