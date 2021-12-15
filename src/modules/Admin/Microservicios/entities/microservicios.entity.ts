import 'reflect-metadata'
import { ObjectType, Field, ID } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { ProveedoresServicios } from '../../ProveedoresServicios/entities/proveedoresservicios.entity'

@ObjectType()
export class Microservicios {
    @Field((type) => ID)
    microservicio_id: number

    @Field((type) => String)
    @IsNotEmpty()
    name: string

    @Field((type) => String)
    @IsNotEmpty()
    url: string

    @Field((type) => Boolean)
    @IsNotEmpty()
    activo: boolean

    @Field((type) => [ProveedoresServicios], { nullable: true })
    ProveedoresServiciosSec?: ProveedoresServicios[]
}