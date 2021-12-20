import { Test } from '@nestjs/testing';
import { CreateIconoInput, UpdateIconoInput } from './dto/iconos.dto';
import { IconosResolver } from './iconos.resolver';
import { IconosService } from './iconos.service';


describe('Iconos Resolver', () => {
    let iconosResolver: IconosResolver;
    let iconosService: IconosService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                IconosResolver,
                {
                    provide: IconosService,
                    useFactory: () => ({
                        getIconos: jest.fn(),
                        getIconoById: jest.fn(),
                        getFilterIconos: jest.fn(),
                        createIcono: jest.fn(),
                        updateIcono: jest.fn(),
                        deleteIcono: jest.fn()
                    }),
                },
            ],
        }).compile();

        iconosResolver = module.get<IconosResolver>(IconosResolver);
        iconosService = module.get<IconosService>(IconosService);
    });

    describe('Query getIconos()', () => {
        it('should invoke iconosService.getIconos()', async () => {
            await iconosResolver.getIconos();
            expect(iconosService.getIconos).toHaveBeenCalled();
        });
    });

    describe('Query getIconoById()', () => {
        it('should invoke iconosService.getIconoById', async () => {
            const testParams = {
                icono_id: 1
            };
            await iconosResolver.getIconoById(testParams.icono_id);
            expect(iconosService.getIconoById).toHaveBeenCalled();
        });
    });

    describe('Query getFilterIconos()', () => {
        it('should invoke iconosService.getFilterIconos()', async () => {
            const testParams = {
                unicode: "a",
                nombre: "a"
            };
            await iconosResolver.getFilterIconos(testParams.unicode, testParams.nombre);
            expect(iconosService.getFilterIconos).toHaveBeenCalled();
        });
    });

    describe('Mutation createIcono()', () => {
        it('should invoke iconosService.createIcono', async () => {
            var testParams: CreateIconoInput;
            await iconosResolver.createIcono(testParams);
            expect(iconosService.createIcono).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation updateIcono()', () => {
        it('should invoke iconosService.updateIcono', async () => {
            var testParams: UpdateIconoInput;
            await iconosResolver.updateIcono(testParams);
            expect(iconosService.updateIcono).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation deleteIcono()', () => {
        it('should invoke iconosService.deleteIcono', async () => {
            var testParams = {
                icono_id: 1
            };
            await iconosResolver.deleteIcono(testParams.icono_id);
            expect(iconosService.deleteIcono).toHaveBeenCalled();
        });
    });
});