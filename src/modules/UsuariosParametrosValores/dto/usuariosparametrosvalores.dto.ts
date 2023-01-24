import { Field, InputType, Int } from "@nestjs/graphql"
import { IsNotEmpty } from "class-validator"

@InputType()
export class UpdateUsuarioParametroValorInput {

    @Field(() => Int)
    @IsNotEmpty()
    usuario_parametro_valor_id: number

    @Field(() => String, { nullable: true })
    valor?: string
}
