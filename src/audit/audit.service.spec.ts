import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { AuditService } from './audit.service';

describe('Audit Service', () => {
    let auditService: AuditService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                AuditService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        audits: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            create: jest.fn(() => {
                                return {
                                    audit_id: Number,
                                };
                            }),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    }),
                },
            ],
        }).compile();

        auditService = module.get<AuditService>(AuditService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getAudits method', () => {
        it('should invoke prismaService.audits.findMany', async () => {
            await auditService.getAudits();
            expect(prismaService.audits.findMany).toHaveBeenCalled();
        });
    });

    describe('registerAudit method', () => {
        it('should invoke prismaService.audits.create', async () => {
            const testParams = {
                data: {
                    audit_id: 2,
                    login_id: 3,
                    status: "authorized",
                    type: "signin",
                    username: "usuario2",
                    role: "admin",
                    has_twofactor: 0
                }
            };
            await auditService.registerAudit(
                testParams.data
            );
            expect(prismaService.audits.create).toHaveBeenCalled();
        });
    });
});
