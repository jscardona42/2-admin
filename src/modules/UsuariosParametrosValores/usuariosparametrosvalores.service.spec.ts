import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { UsuariosParametrosValoresService } from './usuariosparametrosvalores.service';

describe('UsuariosSesiones Service', () => {
    let prismaService: PrismaService;
    let usuariosParametrosValoresService: UsuariosParametrosValoresService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsuariosParametrosValoresService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        usuariosParametrosValores: {
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

        usuariosParametrosValoresService = module.get<UsuariosParametrosValoresService>(UsuariosParametrosValoresService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getUsuariosParametrosValores method', () => {
        it('should invoke prismaService.getUsuariosParametrosValores.findMany', async () => {
            await usuariosParametrosValoresService.getUsuariosParametrosValores();
            expect(prismaService.usuariosParametrosValores.findMany).toHaveBeenCalled();
        });
    });

    describe('getUsuarioParametroValorById method', () => {
        it('should invoke prismaService.getUsuarioParametroValorById.findUnique', async () => {
            const testParams = {
                usuario_parametro_valor_id: 1
            };
            await usuariosParametrosValoresService.getUsuarioParametroValorById(
                testParams.usuario_parametro_valor_id
            );
            expect(prismaService.usuariosParametrosValores.findUnique).toHaveBeenCalled();
        });
    });
})