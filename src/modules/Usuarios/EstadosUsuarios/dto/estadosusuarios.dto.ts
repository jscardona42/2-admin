import 'reflect-metadata'
import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'


@InputType()
export class CreateEstadosUsuariosInput {

    @Field(() => String)
    @IsNotEmpty()
    nombre: string

}

@InputType()
export class UpdateEstadosUsuariosInput {

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