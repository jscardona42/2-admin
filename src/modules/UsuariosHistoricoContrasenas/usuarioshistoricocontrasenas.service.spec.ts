import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { UsuariosHistoricoContrasenasService } from './usuarioshistoricocontrasenas.service';

describe('UsuariosHistoricoContrasenas Service', () => {
    let prismaService: PrismaService;
    let usuariosHistoricoContrasenasService: UsuariosHistoricoContrasenasService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsuariosHistoricoContrasenasService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        usuariosHistoricoContrasenas: {
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

        usuariosHistoricoContrasenasService = module.get<UsuariosHistoricoContrasenasService>(UsuariosHistoricoContrasenasService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getUsuariosHistoricoContrasenas method', () => {
        it('should invoke prismaService.getUsuariosHistoricoContrasenas.findMany', async () => {
            await usuariosHistoricoContrasenasService.getUsuariosHistoricoContrasenas();
            expect(prismaService.usuariosHistoricoContrasenas.findMany).toHaveBeenCalled();
        });
    });

    describe('getUsuarioHistoricoContrasenaById method', () => {
        it('should invoke prismaService.getUsuarioHistoricoContrasenaById.findUnique', async () => {
            const testParams = {
                usu_historico_contrasena_id: 1
            };
            await usuariosHistoricoContrasenasService.getUsuarioHistoricoContrasenaById(
                testParams.usu_historico_contrasena_id
            );
            expect(prismaService.usuariosHistoricoContrasenas.findUnique).toHaveBeenCalled();
        });
    });
})