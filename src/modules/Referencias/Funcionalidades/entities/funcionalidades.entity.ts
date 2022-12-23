import { Directive, ObjectType, Field, Int } from '@nestjs/graphql';
import { FuncionalidadesPerfiles } from '../../../../modules/FuncionalidadesPerfiles/entities/funcionalidadesperfiles.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields:"funcionalidad_id")')
export class Funcionalidades {
    @Field(() => Int)
    @Directive('@external')
    funcionalidad_id: number;

    @Field(() => FuncionalidadesPerfiles)
    FuncionalidadesPerfiles?: FuncionalidadesPerfiles;
}