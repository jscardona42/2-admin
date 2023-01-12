
import { registerEnumType } from '@nestjs/graphql';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { TbTipoUsuariosService } from './tipousuarios.service';

describe('Usuarios Service', () => {
    let prismaService: PrismaService;
    let TipoUsuariosService: TbTipoUsuariosService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TbTipoUsuariosService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        tbTipoUsuarios: {
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

        TipoUsuariosService = module.get<TbTipoUsuariosService>(TbTipoUsuariosService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getTipoUsuarios method', () => {
        it('should invoke prismaService.TipoUsuariosService.findMany', async () => {
            await TipoUsuariosService.getTipoUsuarios();
            expect(prismaService.tbTipoUsuarios.findMany).toHaveBeenCalled();
        });
    });

    describe('getTipoUsuarioById method', () => {
        it('should invoke prismaService.TipoUsuariosService.findUnique', async () => {
            const testParams = {
                usuario_id: 1
            };
            await TipoUsuariosService.getTipoUsuarioById(
                testParams.usuario_id
            );
            expect(prismaService.tbTipoUsuarios.findUnique).toHaveBeenCalled();
        });
    });

    describe('getFilterUsuarios method', () => {
        it('should invoke prismaService.TipoUsuariosService.findMany', async () => {
            const testParams = {
                nombre: "Andres",
                Estado: "ACTIVO"
            };
            await TipoUsuariosService.getFilterTipoUsuarios(
                testParams
            );
            expect(prismaService.tbTipoUsuarios.findMany).toHaveBeenCalled();
        });
    });

    describe('createTipoUsuario method', () => {
        it('should invoke prismaService.TipoUsuariosService.create', async () => {
            const testParams = {
                data: {
                    nombre: "Andres"
                }
            };
            await TipoUsuariosService.createTipoUsuario(
                testParams.data,
            );
            expect(prismaService.tbTipoUsuarios.create).toHaveBeenCalled();
        });
    });

    describe('updateTipoUsuario method', () => {
        it('should invoke prismaService.TipoUsuariosService.update', async () => {
            const testParams = {
                data: {
                    tipo_usuario_id: 1,
                    nombre: "Test",
                    Estado: "INACTIVO"
                }
            };
            await TipoUsuariosService.updateTipoUsuario(
                testParams.data
            );
            expect(prismaService.tbTipoUsuarios.update).toHaveBeenCalled();
        });
    });

    describe('deleteTipoUsuario method', () => {
        it('should invoke prismaService.TipoUsuariosService.delete', async () => {
            const testParams = {
                tipo_usuario_id: 1
            };
            await TipoUsuariosService.deleteTipoUsuario(
                testParams.tipo_usuario_id
            );
            expect(prismaService.tbTipoUsuarios.delete).toHaveBeenCalled();
        });
    });

})