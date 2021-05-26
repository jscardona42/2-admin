import 'reflect-metadata'
import { ObjectType, Field, ID} from '@nestjs/graphql'
import { IsEmail, IsNotEmpty } from 'class-validator'

@ObjectType()
export class User {
    @Field((type) => ID)
    id: number

    @Field()
    @IsNotEmpty()
    name: string

    @Field()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @Field((type) => Number, { nullable: true })
    state?: number | null

    @Field((type) => Number, { nullable: true })
    empresa_id?: number | null
}
