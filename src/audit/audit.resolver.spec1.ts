import { Test } from '@nestjs/testing';
import { AuditResolver } from './audit.resolver';
import { AuditService } from './audit.service';

describe('Menu Resolver', () => {
  let auditResolver: AuditResolver;
  let auditService: AuditService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuditResolver,
        {
          provide: AuditService,
          useFactory: () => ({
            getAudits: jest.fn()
          }),
        },
      ],
    }).compile();

    auditResolver = module.get<AuditResolver>(AuditResolver);
    auditService = module.get<AuditService>(AuditService);
  });

  describe('Query getAudits()', () => {
    it('should invoke auditService.getAudits()', async () => {
      await auditResolver.getAudits();
      expect(auditService.getAudits).toHaveBeenCalled();
    });
  });

});