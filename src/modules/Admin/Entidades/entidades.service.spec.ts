
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { EntidadesService } from './entidades.service';


describe('Entidades Service', () => {
    let prismaService: PrismaService;
    let entidadesService: EntidadesService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                EntidadesService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        entidades: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                            createMany: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        }
                    }),
                },
            ],
        }).compile();

        entidadesService = module.get<EntidadesService>(EntidadesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getEntidades method', () => {
        it('should invoke prismaService.entidades.findMany', async () => {
            await entidadesService.getEntidades();
            expect(prismaService.entidades.findMany).toHaveBeenCalled();
        });
    });

    describe('getEntidadeById method', () => {
        it('should invoke prismaService.entidades.findUnique', async () => {
            const testParams = {
                entidad_id: 1
            };
            await entidadesService.getEntidadeById(
                testParams.entidad_id
            );
            expect(prismaService.entidades.findUnique).toHaveBeenCalled();
        });
    });

    describe('getFilterEntidades method', () => {
        it('should invoke prismaService.entidades.findMany', async () => {
            const testParams = {
                nombre: "a"
            };
            await entidadesService.getFilterEntidades(testParams.nombre);
            expect(prismaService.entidades.findMany).toHaveBeenCalled();
        });
    });


    describe('createEntidad method', () => {
        it('should invoke prismaService.entidades.create', async () => {
            var testParams = {
                data: {
                    nombre: "Nombre",
                    unicode: "a",
                }
            }
            await entidadesService.createEntidad(testParams.data);
            expect(prismaService.entidades.findFirst).toHaveBeenCalled();
        });
    });

    describe('updateEntidad method', () => {
        it('should invoke prismaService.entidades.update', async () => {
            var testParams = {
                data: {
                    nombre: "Nombre",
                    unicode: "a",
                    entidad_id: 1
                }
            }
            await entidadesService.updateEntidad(testParams.data);
            expect(prismaService.entidades.update).toHaveBeenCalled();
        });
    });

    describe('deleteEntidad method', () => {
        it('should invoke prismaService.entidades.delete', async () => {
            const testParams = {
                entidad_id: 1
            };
            await entidadesService.deleteEntidad(testParams.entidad_id);
            expect(prismaService.entidades.delete).toHaveBeenCalled();
        });
    });

})