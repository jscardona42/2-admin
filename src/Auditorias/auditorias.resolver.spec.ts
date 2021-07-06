import { Test } from '@nestjs/testing';
import { AuditoriasResolver } from './auditorias.resolver';
import { AuditoriasService } from './auditorias.service';

describe('Menu Resolver', () => {
  let auditResolver: AuditoriasResolver;
  let auditService: AuditoriasService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuditoriasResolver,
        {
          provide: AuditoriasService,
          useFactory: () => ({
            getAudits: jest.fn()
          }),
        },
      ],
    }).compile();

    auditResolver = module.get<AuditoriasResolver>(AuditoriasResolver);
    auditService = module.get<AuditoriasService>(AuditoriasService);
  });

  describe('Query getAudits()', () => {
    it('should invoke auditService.getAudits()', async () => {
      await auditResolver.getAudits();
      expect(auditService.getAudits).toHaveBeenCalled();
    });
  });

});