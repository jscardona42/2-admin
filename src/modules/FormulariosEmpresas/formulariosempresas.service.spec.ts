import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { FormulariosEmpresasService } from './formulariosempresas.service';

describe('FormulariosEmpresas Service', () => {
    let prismaService: PrismaService;
    let formulariosEmpresasService: FormulariosEmpresasService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                FormulariosEmpresasService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        formulariosEmpresas: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                            createMany: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    }),
                },
            ],
        }).compile();

        formulariosEmpresasService = module.get<FormulariosEmpresasService>(FormulariosEmpresasService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getFormulariosEmpresas method', () => {
        it('should invoke prismaService.getFormulariosEmpresas.findMany', async () => {
            await formulariosEmpresasService.getFormulariosEmpresas();
            expect(prismaService.formulariosEmpresas.findMany).toHaveBeenCalled();
        });
    });

    describe('getFormularioEmpresaById method', () => {
        it('should invoke prismaService.getFormularioEmpresaById.findUnique', async () => {
            const testParams = {
                formulario_empresa_id: 1
            };
            await formulariosEmpresasService.getFormularioEmpresaById(
                testParams.formulario_empresa_id
            );
            expect(prismaService.formulariosEmpresas.findUnique).toHaveBeenCalled();
        });
    });

    describe('getFilterFormulariosEmpresas method', () => {
        it('should invoke prismaService.getFilterFormulariosEmpresas.findMany', async () => {
            const testParams = {
                estado: true
            };
            await formulariosEmpresasService.getFilterFormulariosEmpresas(
                testParams
            );
            expect(prismaService.formulariosEmpresas.findMany).toHaveBeenCalled();
        });
    });

    describe('createFormularioEmpresa method', () => {
        it('should invoke prismaService.createFormularioEmpresa.create', async () => {
            const testParams = {
                data: {
                    estado: true,
                    formulario_gestion_id: 1
                }
            };
            await formulariosEmpresasService.createFormularioEmpresa(
                testParams.data,
            );
            expect(prismaService.formulariosEmpresas.create).toHaveBeenCalled();
        });
    });

    describe('updateFormularioEmpresa method', () => {
        it('should invoke prismaService.updateFormularioEmpresa.update', async () => {
            const testParams = {
                data: {
                    formulario_empresa_id: 1,
                    estado: true,
                    formulario_gestion_id: 1
                }
            };
            await formulariosEmpresasService.updateFormularioEmpresa(
                testParams.data
            );
            expect(prismaService.formulariosEmpresas.update).toHaveBeenCalled();
        });
    });

})