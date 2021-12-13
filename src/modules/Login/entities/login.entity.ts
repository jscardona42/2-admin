import 'reflect-metadata'
import { ObjectType, Field, ID, InputType, InterfaceType, Int } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { DoblesFactores } from '../../DoblesFactores/entities/doblesfactores.entity';
import { Usuarios } from '../../Usuarios/entities/usuarios.entity';

@ObjectType()
export class Login {
  @Field((type) => ID)
  login_id: number

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
  rol_id?: number

  @Field((type) => Number, { nullable: true })
  tiene_doble_factor?: number | null

  @Field((type) => Number, { nullable: true })
  usuario_id?: number | null

  @Field((type) => Usuarios, { nullable: true })
  Usuarios?: Usuarios

  @Field((type) => [DoblesFactores], { nullable: true })
  DoblesFactores?: DoblesFactores[]

}