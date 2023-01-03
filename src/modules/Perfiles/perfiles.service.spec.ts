import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { PerfilesService } from './perfiles.service';
import { FormulariosEmpresasService } from '../FormulariosEmpresas/formulariosempresas.service';

describe('Perfiles Service', () => {
    let prismaService: PrismaService;
    let perfilesService: PerfilesService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                PerfilesService, FormulariosEmpresasService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        perfiles: {
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

        perfilesService = module.get<PerfilesService>(PerfilesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getPerfiles method', () => {
        it('should invoke prismaService.getPerfiles.findMany', async () => {
            await perfilesService.getPerfiles();
            expect(prismaService.perfiles.findMany).toHaveBeenCalled();
        });
    });

    describe('getPerfilById method', () => {
        it('should invoke prismaService.getPerfilById.findUnique', async () => {
            const testParams = {
                perfil_id: 1
            };
            await perfilesService.getPerfilById(
                testParams.perfil_id
            );
            expect(prismaService.perfiles.findUnique).toHaveBeenCalled();
        });
    });

    describe('getFilterPerfiles method', () => {
        it('should invoke prismaService.getFilterPerfiles.findMany', async () => {
            const testParams = {
                nombre: "test"
            };
            await perfilesService.getFilterPerfiles(
                testParams
            );
            expect(prismaService.perfiles.findMany).toHaveBeenCalled();
        });
    });

    describe('createPerfil method', () => {
        it('should invoke prismaService.createPerfil.create', async () => {
            const testParams = {
                data: {
                    nombre: "test",
                    descripcion: "test",
                    personalizado: true
                }
            };
            await perfilesService.createPerfil(
                testParams.data,
            );
            expect(prismaService.perfiles.create).toHaveBeenCalled();
        });
    });

    describe('updatePerfil method', () => {
        it('should invoke prismaService.updatePerfil.update', async () => {
            const testParams = {
                data: {
                    perfil_id: 1,
                    nombre: "test",
                    descripcion: "test",
                    personalizado: true
                }
            };
            await perfilesService.updatePerfil(
                testParams.data
            );
            expect(prismaService.perfiles.update).toHaveBeenCalled();
        });
    });

})