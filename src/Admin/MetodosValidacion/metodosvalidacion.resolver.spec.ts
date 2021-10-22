import { Test } from '@nestjs/testing';
import { CreateMetodoValidacionInput, UpdateMetodoValidacionInput } from './dto/metodosvalidacion.dto';
import { MetodosValidacionResolver } from './metodosvalidacion.resolver';
import { MetodosValidacionService } from './metodosvalidacion.service';


describe('Iconos Resolver', () => {
    let metodosValidacionResolver: MetodosValidacionResolver;
    let metodosValidacionService: MetodosValidacionService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                MetodosValidacionResolver,
                {
                    provide: MetodosValidacionService,
                    useFactory: () => ({
                        getMetodosValidacion: jest.fn(),
                        getMetodoValidacionById: jest.fn(),
                        getFilterMetodosValidacion: jest.fn(),
                        createMetodoValidacion: jest.fn(),
                        updateMetodoValidacion: jest.fn(),
                        deleteMetodoValidacion: jest.fn()
                    }),
                },
            ],
        }).compile();

        metodosValidacionResolver = module.get<MetodosValidacionResolver>(MetodosValidacionResolver);
        metodosValidacionService = module.get<MetodosValidacionService>(MetodosValidacionService);
    });

    describe('Query getMetodosValidacion()', () => {
        it('should invoke metodosValidacionService.getMetodosValidacion()', async () => {
            await metodosValidacionResolver.getMetodosValidacion();
            expect(metodosValidacionService.getMetodosValidacion).toHaveBeenCalled();
        });
    });

    describe('Query g()', () => {
        it('should invoke metodosValidacionService.g', async () => {
            const testParams = {
                metodo_validacion_id: 1
            };
            await metodosValidacionResolver.getMetodoValidacionById(testParams.metodo_validacion_id);
            expect(metodosValidacionService.getMetodoValidacionById).toHaveBeenCalled();
        });
    });

    describe('Query getFilterMetodosValidacion()', () => {
        it('should invoke metodosValidacionService.getFilterMetodosValidacion()', async () => {
            const testParams = {
                metodo: "a"
            };
            await metodosValidacionResolver.getFilterMetodosValidacion(testParams.metodo);
            expect(metodosValidacionService.getFilterMetodosValidacion).toHaveBeenCalled();
        });
    });

    describe('Mutation createMetodoValidacion()', () => {
        it('should invoke metodosValidacionService.createMetodoValidacion', async () => {
            var testParams: CreateMetodoValidacionInput;
            await metodosValidacionResolver.createMetodoValidacion(testParams);
            expect(metodosValidacionService.createMetodoValidacion).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation updateMetodoValidacion()', () => {
        it('should invoke metodosValidacionService.updateMetodoValidacion', async () => {
            var testParams: UpdateMetodoValidacionInput;
            await metodosValidacionResolver.updateMetodoValidacion(testParams);
            expect(metodosValidacionService.updateMetodoValidacion).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation deleteMetodoValidacion()', () => {
        it('should invoke metodosValidacionService.deleteMetodoValidacion', async () => {
            var testParams = {
                metodo_validacion_id: 1
            };
            await metodosValidacionResolver.deleteMetodoValidacion(testParams.metodo_validacion_id);
            expect(metodosValidacionService.deleteMetodoValidacion).toHaveBeenCalled();
        });
    });
});