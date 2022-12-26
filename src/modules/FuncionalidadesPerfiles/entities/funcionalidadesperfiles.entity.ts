import 'reflect-metadata';
import { Directive, Field, Int, ObjectType } from "@nestjs/graphql"
import { Funcionalidades } from '../../../modules/Referencias/Funcionalidades/entities/funcionalidades.entity';
import { Perfiles } from '../../../modules/Perfiles/entities/perfiles.entity';

@ObjectType()
@Directive('@key(fields:"funcionalidad_perfil_id")')
export class FuncionalidadesPerfiles {
    @Field(() => Int)
    funcionalidad_perfil_id: number

    @Field(() => Perfiles)
    Perfiles: Perfiles

    @Field(() => Number)
    funcionalidad_id: number

    @Field(() => Funcionalidades)
    Funcionalidades?: Funcionalidades;
}