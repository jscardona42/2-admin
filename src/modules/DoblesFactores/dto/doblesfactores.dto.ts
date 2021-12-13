import 'reflect-metadata'
import { ObjectType, Field, ID, InputType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@InputType()
//TwoFactorAuthenticateInput
export class DoblesFactoresValidarInput {
  @Field()
  @IsNotEmpty()
  login_id: number

  @Field()
  @IsNotEmpty()
  codigo: string
}

@InputType()
//RecoveryCodeInput
export class CodigoRecuperacionInput {
  @Field()
  @IsNotEmpty()
  login_id: number

  @Field()
  @IsNotEmpty()
  codigo_recuperacion: string
}

@InputType()
//configTwoFactorInput
export class configDoblesFactoresInput {
  @Field()
  @IsNotEmpty()
  login_id: number

  @Field()
  metodo_validacion_id: number
}

@InputType()
export class ValidarCodigoInput {
  @Field()
  @IsNotEmpty()
  login_id: number

  @Field()
  @IsNotEmpty()
  codigo_validacion: string
}