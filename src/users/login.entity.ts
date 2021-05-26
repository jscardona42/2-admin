import 'reflect-metadata'
import { ObjectType, Field, ID, InputType, InterfaceType, Int } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { User } from './user.entity';
import { Twofactor } from '../Twofactor/twofactor.entity';

@ObjectType()
export class Login {
  @Field((type) => ID)
  id: number

  @Field()
  @IsNotEmpty()
  username: string

  @Field()
  @IsNotEmpty()
  password: string

  @Field((type) => String, { nullable: true })
  token?: string | null

  @Field((type) => String, { nullable: true })
  salt?: string | null

  @Field((type) => Number)
  role_id?: number

  @Field((type) => Number, { nullable: true })
  active_two_factor?: number | null

  @Field((type) => Number, { nullable: true })
  user_id?: number | null

  @Field((type) => User)
  Users?: User

  @Field((type) => [Twofactor], { nullable: true })
  Twofactor?: Twofactor[]

}

@InputType()
export class SignUpUserInput {
  @Field()
  @IsNotEmpty()
  username: string

  @Field()
  @IsNotEmpty()
  password: string

  @Field()
  role_id: number
}

@InputType()
export class SignInUserInput {
  @Field()
  username: string

  @Field()
  password: string
}

@InputType()
export class UpdateUserInput {
  @Field()
  id: number

  @Field()
  @IsNotEmpty()
  name: string
}

@InputType()
export class DeleteUserInput {
  @Field()
  id: number
}
