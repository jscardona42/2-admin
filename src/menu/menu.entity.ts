import 'reflect-metadata'
import { ObjectType, Field, ID, InputType, InterfaceType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty } from 'class-validator'

@ObjectType()
export class Menu {
    @Field((type) => ID)
    id: number

    @Field((type) => String, { nullable: true })
    menu1?: string | null

    @Field((type) => String, { nullable: true })
    menu2?: string | null

    @Field((type) => String, { nullable: true })
    menu3?: string | null

    @Field((type) => String, { nullable: true })
    permission?: string | null

}