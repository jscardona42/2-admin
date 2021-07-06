import 'reflect-metadata';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Empresas } from 'src/Empresas/entities/empresas.entity';

@ObjectType()
export class EmpresasMenus {
    @Field(type => ID)
    empresa_menu_id: number

    @Field(type => Empresas)
    Empresas: Empresas

    @Field(type => Number)
    menu_id: number

}