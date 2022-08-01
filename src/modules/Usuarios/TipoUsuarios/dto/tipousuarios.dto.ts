import 'reflect-metadata'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { Estado } from '@prisma/client'

registerEnumType(Estado, {
    name: 'Estado'
})

@InputType()
export class CreateTipoUsuariosInput {

    @Field(() => String)
    @IsNotEmpty()
    nombre: string

}

@InputType()
export class UpdateTipoUsuariosInput {

    @Field(() => Number)
    @IsNotEmpty()
    tipo_usuario_id: number 

    @Field(() => String, {nullable: true})
    nombre?: string

    @Field(() => Estado, {nullable: true})
    estado?: Estado

}

@InputType()
export class FilterTipoUsuariosInput {

    @Field(() => String, {nullable: true})
    nombre?: string 

    @Field(() => Estado, {nullable: true})
    estado?: Estado

}