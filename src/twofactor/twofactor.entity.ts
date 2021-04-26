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

  @Field((type) => Number, { nullable: true })
  config_twofactor?: number | null

  @Field((type) => String, { nullable: true })
  qr_code?: string | null

  @Field((type) => Number, { nullable: true })
  login_id?: number | null

  @Field((type) => String, { nullable: true })
  recovery_code?: string | null

  @Field()
  validation_method_id: number

  @Field((type) => String, { nullable: true })
  time_creation_code: Date
}

@InputType()
export class TwoFactorAuthenticateInput {
  @Field()
  @IsNotEmpty()
  login_id: number

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
export class configTwoFactorInput {
  @Field()
  @IsNotEmpty()
  login_id: number

  @Field()
  validation_method_id: number
}

@InputType()
export class ValidateCodeInput {
  @Field()
  @IsNotEmpty()
  login_id: number

  @Field()
  @IsNotEmpty()
  validate_code: string
}
