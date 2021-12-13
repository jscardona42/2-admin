import { Test } from '@nestjs/testing';
import { CreateValidacionInput, UpdateValidacionInput } from './dto/validaciones.dto';
import { ValidacionesResolver } from './validaciones.resolver';
import { ValidacionesService } from './validaciones.service';


describe('Iconos Resolver', () => {
    let validacionesResolver: ValidacionesResolver;
    let validacionesService: ValidacionesService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ValidacionesResolver,
                {
                    provide: ValidacionesService,
                    useFactory: () => ({
                        getValidaciones: jest.fn(),
                        getPermisosValidaciones: jest.fn(),
                        getPermisoValidacionById: jest.fn(),
                        getValidacionById: jest.fn(),
                        updateValidacion: jest.fn(),
                        deleteValidacion: jest.fn()
                    }),
                },
            ],
        }).compile();

        validacionesResolver = module.get<ValidacionesResolver>(ValidacionesResolver);
        validacionesService = module.get<ValidacionesService>(ValidacionesService);
    });

    describe('Query getValidaciones()', () => {
        it('should invoke validacionesService.getValidaciones()', async () => {
            await validacionesResolver.getValidaciones();
            expect(validacionesService.getValidaciones).toHaveBeenCalled();
        });
    });

    describe('Query gePermisosValidaciones()', () => {
        it('should invoke validacionesService.gePermisosValidaciones()', async () => {
            await validacionesResolver.getPermisosValidaciones();
            expect(validacionesService.getPermisosValidaciones).toHaveBeenCalled();
        });
    });

    describe('Query getValidacionById()', () => {
        it('should invoke validacionesService.getValidacionById', async () => {
            const testParams = {
                validacion_id: 1
            };
            await validacionesResolver.getValidacionById(testParams.validacion_id);
            expect(validacionesService.getValidacionById).toHaveBeenCalled();
        });
    });

    describe('Query getPermisoValidacionById()', () => {
        it('should invoke validacionesService.getPermisoValidacionById', async () => {
            const testParams = {
                permiso_validacion_id: 1
            };
            await validacionesResolver.getPermisoValidacionById(testParams.permiso_validacion_id);
            expect(validacionesService.getPermisoValidacionById).toHaveBeenCalled();
        });
    });

    describe('Mutation updateValidacion()', () => {
        it('should invoke validacionesService.updateValidacion', async () => {
            var testParams: UpdateValidacionInput;
            await validacionesResolver.updateValidacion(testParams);
            expect(validacionesService.updateValidacion).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation deleteValidacion()', () => {
        it('should invoke validacionesService.deleteValidacion', async () => {
            var testParams = {
                validacion_id: 1
            };
            await validacionesResolver.deleteValidacion(testParams.validacion_id);
            expect(validacionesService.deleteValidacion).toHaveBeenCalled();
        });
    });
});