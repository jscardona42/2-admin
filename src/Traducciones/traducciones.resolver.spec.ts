import { Test } from '@nestjs/testing';
import { TraduccionesResolver } from './traducciones.resolver';
import { TraduccionesService } from './traducciones.service';

describe('Traducciones Resolver', () => {
    let traduccionesService: TraduccionesService;
    let traduccionesResolver: TraduccionesResolver;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TraduccionesResolver,
                {
                    provide: TraduccionesService,
                    useFactory: () => ({
                        getTraducciones: jest.fn(),
                        getTraduccionById: jest.fn(),
                        createTraduccion: jest.fn(),
                        updateTraduccion: jest.fn(),
                        deleteTraduccion: jest.fn()
                    }),
                },
            ],
        }).compile();

        traduccionesResolver = module.get<TraduccionesResolver>(TraduccionesResolver);
        traduccionesService = module.get<TraduccionesService>(TraduccionesService);
    });

    describe('Query getTraducciones()', () => {
        it('should invoke traduccionesService.getTraducciones()', async () => {
            await traduccionesResolver.getTraducciones();
            expect(traduccionesService.getTraducciones).toHaveBeenCalled();
        });
    });

    describe('Query getTraduccionById()', () => {
        it('should invoke traduccionesService.getTraduccionById', async () => {
            const testParams = {
                traduccion_id: 1
            };
            await traduccionesResolver.getTraduccionById(testParams.traduccion_id);
            expect(traduccionesService.getTraduccionById).toHaveBeenCalled();
        });
    });

    describe('Query createTraduccion()', () => {
        it('should invoke traduccionesService.createTraduccion', async () => {
            const testParams = {
                data: {
                    idioma: "Palabra"
                }
            };
            await traduccionesResolver.createTraduccion(testParams.data);
            expect(traduccionesService.createTraduccion).toHaveBeenCalled();
        });
    });

    describe('Mutation updateTraduccion()', () => {
        it('should invoke traduccionesService.updateTraduccion with arguments', async () => {
            const testParams = {
                data: {
                    idioma: "Palabra",
                    traduccion_id: 1
                }
            };
            await traduccionesResolver.updateTraduccion(testParams.data);
            expect(traduccionesService.updateTraduccion).toHaveBeenCalledWith(
                testParams.data
            );
        });
    });

    describe('Mutation deleteTraduccion()', () => {
        it('should invoke traduccionesService.deleteTraduccion with arguments', async () => {
            const testParams = {
                traduccion_id: 1
            };
            await traduccionesResolver.deleteTraduccion(testParams.traduccion_id);
            expect(traduccionesService.deleteTraduccion).toHaveBeenCalledWith(
                testParams.traduccion_id
            );
        });
    });
});