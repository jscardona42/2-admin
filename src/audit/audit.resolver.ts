import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuditService } from './audit.service';
import { Audit } from './entities/audit.entity';

@Resolver(() => Audit)
export class AuditResolver {

    constructor(
        private readonly auditService: AuditService
    ) { }

    @Query(() => [Audit])
    async getAudits(): Promise<Audit[]> {
        return await this.auditService.getAudits();
    }

}
