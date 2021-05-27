import 'reflect-metadata'
import { ObjectType, Field, ID, InputType } from '@nestjs/graphql'

@ObjectType()
export class DoblesFactores {
  @Field((type) => ID)
  doble_factor_id: number

  @Field((type) => String, { nullable: true })
  otplib_secreta?: string | null

  @Field((type) => Boolean, { nullable: true })
  esta_configurado?: boolean | null

  @Field((type) => String, { nullable: true })
  qr_code?: string | null

  @Field((type) => Number)
  login_id: number | null

  @Field((type) => String, { nullable: true })
  codigo_recuperacion?: string | null

  @Field((type) => Number)
  metodo_validacion_id: number

  @Field((type) => String, { nullable: true })
  fecha_creacion_codigo?: Date
}


