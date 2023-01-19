import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { UsuariosSesionesService } from './usuariossesiones.service';

describe('UsuariosSesiones Service', () => {
    let prismaService: PrismaService;
    let usuariosSesionesService: UsuariosSesionesService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsuariosSesionesService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        usuariosSesiones: {
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

        usuariosSesionesService = module.get<UsuariosSesionesService>(UsuariosSesionesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getUsuariosSesiones method', () => {
        it('should invoke prismaService.getUsuariosSesiones.findMany', async () => {
            await usuariosSesionesService.getUsuariosSesiones();
            expect(prismaService.usuariosSesiones.findMany).toHaveBeenCalled();
        });
    });

    describe('getUsuarioSesionById method', () => {
        it('should invoke prismaService.getUsuarioSesionById.findUnique', async () => {
            const testParams = {
                usuario_sesion_id: 1
            };
            await usuariosSesionesService.getUsuarioSesionById(
                testParams.usuario_sesion_id
            );
            expect(prismaService.usuariosSesiones.findUnique).toHaveBeenCalled();
        });
    });
})