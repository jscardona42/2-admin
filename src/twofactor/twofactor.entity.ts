import 'reflect-metadata'
import { ObjectType, Field, ID, InputType } from '@nestjs/graphql'
import { Login } from 'src/users/login.entity'
import { IsNotEmpty } from 'class-validator'

@ObjectType()
export class Twofactor {
    @Field((type) => ID)
    twofactor_id: number

    @Field((type) => String, { nullable: true })
    twofactor_secret?: string | null

    @Field((type) => String, { nullable: true })
    config_twofactor?: string | null

    @Field((type) => String, { nullable: true })
    qr_code?: string | null

    @Field((type) => Number, { nullable: true })
    login_id?: number | null

    @Field({ nullable: true })
    Login: Login

    @Field((type) => String, { nullable: true })
    recovery_codes?: string | null
}

@InputType()
export class ConfigTwofactorInput {
  @Field()
  @IsNotEmpty()
  login_id: string
}

@InputType()
export class TwoFactorAuthenticateInput {
  @Field()
  @IsNotEmpty()
  login_id: string

  @Field()
  @IsNotEmpty()
  code: string
}

@InputType()
export class RecoveryCodeInput {
  @Field()
  @IsNotEmpty()
  twofactor_id: number

  @Field()
  @IsNotEmpty()
  recovery_code: string
}

@InputType()
export class SetTwoFactorInput {
  @Field()
  @IsNotEmpty()
  twofactor_id: string
}