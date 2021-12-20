import 'reflect-metadata'
import { Field, InputType, PartialType, } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'


@InputType()
export class CreateMicroservicioInput {

    @Field((type) => String)
    @IsNotEmpty()
    name: string

    @Field((type) => String)
    @IsNotEmpty()
    url: string

    @Field((type) => Boolean, { nullable: true })
    activo: boolean

}

@InputType()
export class UpdateMicroservicioInput extends PartialType(CreateMicroservicioInput) {
    @Field()
    @IsNotEmpty()
    microservicio_id: number

}
