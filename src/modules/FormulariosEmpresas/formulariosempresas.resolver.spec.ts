import { Test } from '@nestjs/testing';
import { FormulariosEmpresasService } from './formulariosempresas.service';
import { FormulariosEmpresasResolver } from './formulariosempresas.resolver';

describe('FormulariosEmpresas Resolver', () => {
    let formulariosEmpresasResolver: FormulariosEmpresasResolver;
    let formulariosEmpresasService: FormulariosEmpresasService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                FormulariosEmpresasResolver,
                {
                    provide: FormulariosEmpresasService,
                    useFactory: () => ({
                        getFormulariosEmpresas: jest.fn(),
                        getFormularioEmpresaById: jest.fn(),
                        getFilterFormulariosEmpresas: jest.fn(),
                        createFormularioEmpresa: jest.fn(),
                        updateFormularioEmpresa: jest.fn(),
                    }),
                },
            ],
        }).compile();

        formulariosEmpresasResolver = module.get<FormulariosEmpresasResolver>(FormulariosEmpresasResolver);
        formulariosEmpresasService = module.get<FormulariosEmpresasService>(FormulariosEmpresasService);
    });

    describe('Query getFormulariosEmpresas()', () => {
        it('should invoke formulariosEmpresasService.getFormulariosEmpresas()', async () => {
            await formulariosEmpresasResolver.getFormulariosEmpresas();
            expect(formulariosEmpresasService.getFormulariosEmpresas).toHaveBeenCalled();
        });
    });

    describe('Query getFormularioEmpresaById()', () => {
        it('should invoke formulariosEmpresasService.getFormularioEmpresaById', async () => {
            const testParams = {
                tipo_empresa_id: 1
            };
            await formulariosEmpresasResolver.getFormularioEmpresaById(testParams.tipo_empresa_id);
            expect(formulariosEmpresasService.getFormularioEmpresaById).toHaveBeenCalled();
        });
    });

    describe('Query getFilterFormulariosEmpresas()', () => {
        it('should invoke formulariosEmpresasService.getFilterFormulariosEmpresas()', async () => {
            const testParams = {
                estado: true
            };
            await formulariosEmpresasResolver.getFilterFormulariosEmpresas(testParams);
            expect(formulariosEmpresasService.getFilterFormulariosEmpresas).toHaveBeenCalled();
        });
    });

    describe('Mutation createFormularioEmpresa()', () => {
        it('should invoke formulariosEmpresasService.createFormularioEmpresa', async () => {
            const testParams = {
                estado: true,
                formulario_gestion_id: 1
            };

            await formulariosEmpresasResolver.createFormularioEmpresa(testParams);
            expect(formulariosEmpresasService.createFormularioEmpresa).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation updateFormularioEmpresa()', () => {
        it('should invoke formulariosEmpresasService.updateFormularioEmpresa', async () => {
            const testParams = {
                formulario_empresa_id: 1,
                estado: true,
                formulario_gestion_id: 1
            };
            await formulariosEmpresasResolver.updateFormularioEmpresa(testParams);
            expect(formulariosEmpresasService.updateFormularioEmpresa).toHaveBeenCalledWith(testParams);
        });
    });
});