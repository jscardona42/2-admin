
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { MetodosValidacionService } from './metodosvalidacion.service';


describe('Iconos Service', () => {
    let prismaService: PrismaService;
    let metodosValidacionService: MetodosValidacionService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                MetodosValidacionService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        metodosValidacion: {
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

        metodosValidacionService = module.get<MetodosValidacionService>(MetodosValidacionService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getMetodosValidacion method', () => {
        it('should invoke prismaService.metodosValidacion.findMany', async () => {
            await metodosValidacionService.getMetodosValidacion();
            expect(prismaService.metodosValidacion.findMany).toHaveBeenCalled();
        });
    });

    describe('getMetodoValidacionById method', () => {
        it('should invoke prismaService.metodosValidacion.findUnique', async () => {
            const testParams = {
                metodo_validacion_id: 1
            };
            await metodosValidacionService.getMetodoValidacionById(
                testParams.metodo_validacion_id
            );
            expect(prismaService.metodosValidacion.findUnique).toHaveBeenCalled();
        });
    });

    describe('getFilterMetodosValidacion method', () => {
        it('should invoke prismaService.metodosValidacion.findMany', async () => {
            const testParams = {
                metodo: "a"
            };
            await metodosValidacionService.getFilterMetodosValidacion(testParams.metodo);
            expect(prismaService.metodosValidacion.findMany).toHaveBeenCalled();
        });
    });

    describe('createMetodoValidacion method', () => {
        it('should invoke prismaService.metodosValidacion.create', async () => {
            var testParams = {
                data: {
                    metodo: "Nombre"
                }
            }
            await metodosValidacionService.createMetodoValidacion(testParams.data);
            expect(prismaService.metodosValidacion.create).toHaveBeenCalled();
        });
    });

    describe('updateMetodoValidacion method', () => {
        it('should invoke prismaService.metodosValidacion.update', async () => {
            var testParams = {
                data: {
                    metodo: "Nombre",
                    metodo_validacion_id: 1
                }
            }
            await metodosValidacionService.updateMetodoValidacion(testParams.data);
            expect(prismaService.metodosValidacion.update).toHaveBeenCalled();
        });
    });

    describe('deleteMetodoValidacion method', () => {
        it('should invoke prismaService.metodosValidacion.delete', async () => {
            const testParams = {
                metodo_validacion_id: 1
            };
            await metodosValidacionService.deleteMetodoValidacion(testParams.metodo_validacion_id);
            expect(prismaService.metodosValidacion.delete).toHaveBeenCalled();
        });
    });

})