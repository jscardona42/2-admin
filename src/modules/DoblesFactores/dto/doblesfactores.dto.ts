import 'reflect-metadata'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { MetodosValidacion } from '@prisma/client'


registerEnumType(MetodosValidacion, {
  name: 'MetodosValidacion'
})

@InputType()
//TwoFactorAuthenticateInput
export class DoblesFactoresValidarInput {
  @Field()
  @IsNotEmpty()
  usuario_id: number

  @Field()
  @IsNotEmpty()
  codigo: string
}

@InputType()
//RecoveryCodeInput
export class CodigoRecuperacionInput {
  @Field()
  @IsNotEmpty()
  usuario_id: number

  @Field()
  @IsNotEmpty()
  codigo_recuperacion: string
}

@InputType()
//configTwoFactorInput
export class configDoblesFactoresInput {
  @Field()
  @IsNotEmpty()
  usuario_id: number

  @Field((type) => MetodosValidacion)
  @IsNotEmpty()
  metodo_validacion: MetodosValidacion
}

@InputType()
export class ValidarCodigoInput {
  @Field()
  @IsNotEmpty()
  usuario_id: number

  @Field()
  @IsNotEmpty()
  codigo_validacion: string
}