import { Test } from '@nestjs/testing';
import { UpdateEntidadInput } from './dto/entidades.dto';
import { EntidadesResolver } from './entidades.resolver';
import { EntidadesService } from './entidades.service';


describe('Entidades Resolver', () => {
    let entidadesResolver: EntidadesResolver;
    let entidadesService: EntidadesService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                EntidadesResolver,
                {
                    provide: EntidadesService,
                    useFactory: () => ({
                        getEntidades: jest.fn(),
                        getEntidadeById: jest.fn(),
                        getFilterEntidades: jest.fn(),
                        cre: jest.fn(),
                        updateEntidad: jest.fn(),
                        deleteEntidad: jest.fn()
                    }),
                },
            ],
        }).compile();

        entidadesResolver = module.get<EntidadesResolver>(EntidadesResolver);
        entidadesService = module.get<EntidadesService>(EntidadesService);
    });

    describe('Query getEntidades()', () => {
        it('should invoke entidadesService.getEntidades()', async () => {
            await entidadesResolver.getEntidades();
            expect(entidadesService.getEntidades).toHaveBeenCalled();
        });
    });

    describe('Query getEntidadeById()', () => {
        it('should invoke entidadesService.getEntidadeById', async () => {
            const testParams = {
                entidad_id: 1
            };
            await entidadesResolver.getEntidadeById(testParams.entidad_id);
            expect(entidadesService.getEntidadeById).toHaveBeenCalled();
        });
    });

    describe('Query getFilterEntidades()', () => {
        it('should invoke entidadesService.getFilterEntidades()', async () => {
            const testParams = {
                nombre: "a"
            };
            await entidadesResolver.getFilterEntidades(testParams.nombre);
            expect(entidadesService.getFilterEntidades).toHaveBeenCalled();
        });
    });


    describe('Mutation updateEntidad()', () => {
        it('should invoke entidadesService.updateEntidad', async () => {
            var testParams: UpdateEntidadInput;
            await entidadesResolver.updateEntidad(testParams);
            expect(entidadesService.updateEntidad).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation deleteEntidad()', () => {
        it('should invoke entidadesService.deleteEntidad', async () => {
            var testParams = {
                entidad_id: 1
            };
            await entidadesResolver.deleteEntidad(testParams.entidad_id);
            expect(entidadesService.deleteEntidad).toHaveBeenCalled();
        });
    });
});