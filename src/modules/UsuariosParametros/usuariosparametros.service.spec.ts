import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { UsuariosParametrosService } from './usuariosparametros.service';

describe('UsuariosParametros Service', () => {
    let prismaService: PrismaService;
    let usuariosParametrosService: UsuariosParametrosService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsuariosParametrosService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        usuariosParametros: {
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

        usuariosParametrosService = module.get<UsuariosParametrosService>(UsuariosParametrosService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getUsuariosParametros method', () => {
        it('should invoke prismaService.getUsuariosParametros.findMany', async () => {
            await usuariosParametrosService.getUsuariosParametros();
            expect(prismaService.usuariosParametros.findMany).toHaveBeenCalled();
        });
    });

    describe('getUsuarioParametroById method', () => {
        it('should invoke prismaService.getUsuarioParametroById.findUnique', async () => {
            const testParams = {
                usuario_parametro_id: 1
            };
            await usuariosParametrosService.getUsuarioParametroById(
                testParams.usuario_parametro_id
            );
            expect(prismaService.usuariosParametros.findUnique).toHaveBeenCalled();
        });
    });

    describe('getFilterUsuariosParametrosInput method', () => {
        it('should invoke prismaService.getFilterUsuariosParametrosInput.findMany', async () => {
            const testParams = {
                nombre: "test"
            };
            await usuariosParametrosService.getFilterUsuariosParametrosInput(
                testParams
            );
            expect(prismaService.usuariosParametros.findMany).toHaveBeenCalled();
        });
    });

    describe('createUsuarioParametro method', () => {
        it('should invoke prismaService.createUsuarioParametro.create', async () => {
            const testParams = {
                data: {
                    nombre: "test",
                    alias: "test",
                    requerido: true,
                    valor_defecto: "test",
                    descripcion: "test"
                }
            };
            await usuariosParametrosService.createUsuarioParametro(
                testParams.data,
            );
            expect(prismaService.usuariosParametros.create).toHaveBeenCalled();
        });
    });

    describe('updateUsuarioParametro method', () => {
        it('should invoke prismaService.updateUsuarioParametro.update', async () => {
            const testParams = {
                data: {
                    usuario_parametro_id: 1,
                    nombre: "test",
                    alias: "test",
                    requerido: true,
                    valor_defecto: "test",
                    descripcion: "test"
                }
            };
            await usuariosParametrosService.updateUsuarioParametro(
                testParams.data
            );
            expect(prismaService.usuariosParametros.update).toHaveBeenCalled();
        });
    });

})