import { Test } from '@nestjs/testing';
import { AddPermisosToFuncionalidadInput, CreateFuncionalidadInput, FilterFuncionalidadesInput, UpdateFuncionalidadInput } from './dto/funcionalidades.dto';
import { FuncionalidadesResolver } from './funcionalidades.resolver';
import { FuncionalidadesService } from './funcionalidades.service';

describe('Entidades Resolver', () => {
    let funcionalidadesResolver: FuncionalidadesResolver;
    let funcionalidadesService: FuncionalidadesService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                FuncionalidadesResolver,
                {
                    provide: FuncionalidadesService,
                    useFactory: () => ({
                        getFuncionalidades: jest.fn(),
                        getFuncionalidadById: jest.fn(),
                        getFilterFuncionalidades: jest.fn(),
                        createFuncionalidad: jest.fn(),
                        updateFuncionalidad: jest.fn(),
                        addPermisosToFuncionalidad: jest.fn(),
                        deleteFuncionalidad: jest.fn()
                    }),
                },
            ],
        }).compile();

        funcionalidadesResolver = module.get<FuncionalidadesResolver>(FuncionalidadesResolver);
        funcionalidadesService = module.get<FuncionalidadesService>(FuncionalidadesService);
    });

    describe('Query getFuncionalidades()', () => {
        it('should invoke funcionalidadesService.getFuncionalidades()', async () => {
            await funcionalidadesResolver.getFuncionalidades();
            expect(funcionalidadesService.getFuncionalidades).toHaveBeenCalled();
        });
    });

    describe('Query getFuncionalidadById()', () => {
        it('should invoke funcionalidadesService.getFuncionalidadById', async () => {
            const input = {
                funcionalidad_id: 1
            };
            await funcionalidadesResolver.getFuncionalidadById(input.funcionalidad_id);
            expect(funcionalidadesService.getFuncionalidadById).toHaveBeenCalled();
        });
    });

    describe('Query getFilterFuncionalidades()', () => {
        it('should invoke funcionalidadesService.getFilterFuncionalidades()', async () => {
            const input: FilterFuncionalidadesInput = {
                entidad_nombre: ""
            };
            await funcionalidadesResolver.getFilterFuncionalidades(input);
            expect(funcionalidadesService.getFilterFuncionalidades).toHaveBeenCalled();
        });
    });

    describe('Mutation createFuncionalidad()', () => {
        it('should invoke funcionalidadesService.createFuncionalidad', async () => {
            var input: CreateFuncionalidadInput;
            await funcionalidadesResolver.createFuncionalidad(input);
            expect(funcionalidadesService.createFuncionalidad).toHaveBeenCalledWith(input);
        });
    });

    describe('Mutation updateFuncionalidad()', () => {
        it('should invoke funcionalidadesService.updateFuncionalidad', async () => {
            var input: UpdateFuncionalidadInput;
            await funcionalidadesResolver.updateFuncionalidad(input);
            expect(funcionalidadesService.updateFuncionalidad).toHaveBeenCalledWith(input);
        });
    });

    describe('Mutation addPermisosToFuncionalidad()', () => {
        it('should invoke funcionalidadesService.addPermisosToFuncionalidad', async () => {
            var input: AddPermisosToFuncionalidadInput;
            await funcionalidadesResolver.addPermisosToFuncionalidad(input);
            expect(funcionalidadesService.addPermisosToFuncionalidad).toHaveBeenCalledWith(input);
        });
    });

    describe('Mutation deleteFuncionalidad()', () => {
        it('should invoke funcionalidadesService.deleteFuncionalidad', async () => {
            var input = {
                funcionalidad_id: 1
            };
            await funcionalidadesResolver.deleteFuncionalidad(input.funcionalidad_id);
            expect(funcionalidadesService.deleteFuncionalidad).toHaveBeenCalled();
        });
    });
});