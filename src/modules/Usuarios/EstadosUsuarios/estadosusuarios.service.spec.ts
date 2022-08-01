import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { TbEstadosUsuariosService } from './estadosusuarios.service';

describe('Usuarios Service', () => {
    let prismaService: PrismaService;
    let EstadosUsuariosService: TbEstadosUsuariosService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: {
                        expiresIn: process.env.JWT_EXPIRESIN
                    }
                }),
            ],
            providers: [
                TbEstadosUsuariosService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        tbEstadosUsuarios: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    }),
                },
            ],
        }).compile();

        EstadosUsuariosService = module.get<TbEstadosUsuariosService>(TbEstadosUsuariosService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getEstadosUsuarios method', () => {
        it('should invoke prismaService.EstadosUsuariosService.findMany', async () => {
            await EstadosUsuariosService.getEstadosUsuarios();
            expect(prismaService.tbEstadosUsuarios.findMany).toHaveBeenCalled();
        });
    });

    describe('getEstadosUsuariosById method', () => {
        it('should invoke prismaService.EstadosUsuariosService.findUnique', async () => {
            const testParams = {
                usuario_id: 1
            };
            await EstadosUsuariosService.getEstadosUsuariosById(
                testParams.usuario_id
            );
            expect(prismaService.tbEstadosUsuarios.findUnique).toHaveBeenCalled();
        });
    });

    describe('getFilterEstadosUsuarios method', () => {
        it('should invoke prismaService.EstadosUsuariosService.findMany', async () => {
            const testParams = {
                nombre: "Andres"
            };
            await EstadosUsuariosService.getFilterEstadosUsuarios(
                testParams
            );
            expect(prismaService.tbEstadosUsuarios.findMany).toHaveBeenCalled();
        });
    });

    describe('createEstadosUsuarios method', () => {
        it('should invoke prismaService.EstadosUsuariosService.create', async () => {
            const testParams = {
                data: {
                    nombre: "Andres"
                }
            };
            await EstadosUsuariosService.createEstadosUsuarios(
                testParams.data,
            );
            expect(prismaService.tbEstadosUsuarios.create).toHaveBeenCalled();
        });
    });

    describe('updateEstadosUsuarios method', () => {
        it('should invoke prismaService.EstadosUsuariosService.update', async () => {
            const testParams = {
                data: {
                    estado_usuario_id: 1,
                    nombre: "Test",
                }
            };
            await EstadosUsuariosService.updateEstadosUsuarios(
                testParams.data
            );
            expect(prismaService.tbEstadosUsuarios.update).toHaveBeenCalled();
        });
    });

    describe('deleteEstadosUsuarios method', () => {
        it('should invoke prismaService.EstadosUsuariosService.delete', async () => {
            const testParams = {
                estado_usuario_id: 1
            };
            await EstadosUsuariosService.deleteEstadosUsuarios(
                testParams.estado_usuario_id
            );
            expect(prismaService.tbEstadosUsuarios.delete).toHaveBeenCalled();
        });
    });

})