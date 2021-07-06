import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { AuditoriasService } from './auditorias.service';

describe('Audit Service', () => {
    let auditService: AuditoriasService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                AuditoriasService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        auditorias: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            create: jest.fn(() => {
                                return {
                                    auditoria_id: Number,
                                };
                            }),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    }),
                },
            ],
        }).compile();

        auditService = module.get<AuditoriasService>(AuditoriasService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getAuditorias method', () => {
        it('should invoke prismaService.auditorias.findMany', async () => {
            await auditService.getAuditorias();
            expect(prismaService.auditorias.findMany).toHaveBeenCalled();
        });
    });

    describe('registerAudit method', () => {
        it('should invoke prismaService.auditorias.create', async () => {
            const testParams = {
                data: {
                    auditoria_id: 2,
                    login_id: 3,
                    status: "authorized",
                    tipo: "signin",
                    username: "usuario2",
                    rol: "admin",
                    tiene_doble_factor: true
                }
            };
            await auditService.registerAuditoria(
                testParams.data
            );
            expect(prismaService.auditorias.create).toHaveBeenCalled();
        });
    });
});
