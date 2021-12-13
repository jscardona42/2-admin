import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuditoriasService } from './auditorias.service';
import { Auditorias } from './entities/auditorias.entity';

@Resolver(() => Auditorias)
export class AuditoriasResolver {

    constructor(
        private readonly auditoriasService: AuditoriasService
    ) { }

    @Query(() => [Auditorias])
    async getAuditorias(): Promise<Auditorias[]> {
        return await this.auditoriasService.getAuditorias();
    }

}
