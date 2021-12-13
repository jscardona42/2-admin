import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { TraduccionesService } from './traducciones.service';

describe('Traducciones Service', () => {
    let traduccionesService: TraduccionesService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TraduccionesService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        traducciones: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    }),
                },
            ],
        }).compile();

        traduccionesService = module.get<TraduccionesService>(TraduccionesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getTraducciones method', () => {
        it('should invoke prismaService.traducciones.findMany', async () => {
            await traduccionesService.getTraducciones();
            expect(prismaService.traducciones.findMany).toHaveBeenCalled();
        });
    });

    describe('getTraduccionById method', () => {
        it('should invoke prismaService.traducciones.findUnique', async () => {
            const testParams = {
                traduccion_id: 1
            };
            await traduccionesService.getTraduccionById(
                testParams.traduccion_id
            );
            expect(prismaService.traducciones.findUnique).toHaveBeenCalled();
        });
    });

    describe('createTraduccion method', () => {
        it('should invoke prismaService.traducciones.create', async () => {
            const testParams = {
                data: {
                    idioma: "Palabra",
                    sigla: "a"
                }
            };
            await traduccionesService.createTraduccion(
                testParams.data,
            );
            expect(prismaService.traducciones.create).toHaveBeenCalled();
        });
    });

    describe('updateTraduccion method', () => {
        it('should invoke prismaService.traducciones.update', async () => {
            const testParams = {
                data: {
                    idioma: "Palabra",
                    traduccion_id: 2
                }
            };
            await traduccionesService.updateTraduccion(
                testParams.data
            );
            expect(prismaService.traducciones.update).toHaveBeenCalled();
        });
    });

    describe('deleteTraduccion method', () => {
        it('should invoke prismaService.traducciones.delete', async () => {
            const testParams = {
                traduccion_id: 2
            };
            await traduccionesService.deleteTraduccion(
                testParams.traduccion_id
            );
            expect(prismaService.traducciones.delete).toHaveBeenCalled();
        });
    });
});
