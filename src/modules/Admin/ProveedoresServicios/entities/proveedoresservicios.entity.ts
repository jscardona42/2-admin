import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Microservicios } from "../../../Admin/Microservicios/entities/microservicios.entity"

@ObjectType()
export class ProveedoresServicios {
    @Field((type) => ID)
    proveedor_servicio_id: number

    @Field((type) => Microservicios)
    Microservicios: Microservicios

    @Field((type) => String)
    lista_proveedores: string

    @Field((type) => String)
    model_data: string

    @Field((type) => String, { nullable: true })
    status?: string

}