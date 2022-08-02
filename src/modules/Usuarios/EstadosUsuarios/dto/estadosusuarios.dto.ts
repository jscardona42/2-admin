import 'reflect-metadata'
import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'


@InputType()
export class CreateEstadoUsuarioInput {

    @Field(() => String)
    @IsNotEmpty()
    nombre: string

}

@InputType()
export class UpdateEstadoUsuarioInput {

    @Field(() => Number)
    @IsNotEmpty()
    estado_usuario_id: number 

    @Field(() => String)
    @IsNotEmpty()
    nombre: string

}

@InputType()
export class FilterEstadoUsuariosInput {

    @Field(() => String, {nullable: true})
    nombre?: string 

}