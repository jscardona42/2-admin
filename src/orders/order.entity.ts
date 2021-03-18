import 'reflect-metadata'
import { ObjectType, Field, ID, InputType, InterfaceType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty } from 'class-validator'

@ObjectType()
export class Order {
    @Field((type) => ID)
    id: number

    @Field((type) => String)
    @IsNotEmpty()
    order: string
}

@InputType()
export class createOrderInput {
    @Field()
    @IsNotEmpty()
    order: string
}

@InputType()
export class updateOrderInput {
    @Field((type) => ID)
    @IsNotEmpty()
    id: number

    @Field()
    @IsNotEmpty()
    order: string
}
