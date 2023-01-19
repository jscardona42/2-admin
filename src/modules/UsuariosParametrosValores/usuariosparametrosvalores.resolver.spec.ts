import { Test } from '@nestjs/testing';
import { UsuariosParametrosValoresService } from './usuariosparametrosvalores.service';
import { UsuariosParametrosValoresResolver } from './usuariosparametrosvalores.resolver';

describe('UsuariosParametros Resolver', () => {
    let usuariosParametrosValoresResolver: UsuariosParametrosValoresResolver;
    let usuariosParametrosValoresService: UsuariosParametrosValoresService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsuariosParametrosValoresResolver,
                {
                    provide: UsuariosParametrosValoresService,
                    useFactory: () => ({
                        getUsuariosParametrosValores: jest.fn(),
                        getUsuarioParametroValorById: jest.fn(),
                    }),
                },
            ],
        }).compile();

        usuariosParametrosValoresResolver = module.get<UsuariosParametrosValoresResolver>(UsuariosParametrosValoresResolver);
        usuariosParametrosValoresService = module.get<UsuariosParametrosValoresService>(UsuariosParametrosValoresService);
    });

    describe('Query getUsuariosParametrosValores()', () => {
        it('should invoke usuariosParametrosValoresService.getUsuariosParametrosValores()', async () => {
            await usuariosParametrosValoresResolver.getUsuariosParametrosValores();
            expect(usuariosParametrosValoresService.getUsuariosParametrosValores).toHaveBeenCalled();
        });
    });

    describe('Query getUsuarioParametroValorById()', () => {
        it('should invoke usuariosParametrosValoresService.getUsuarioParametroValorById', async () => {
            const testParams = {
                usuario_parametro_valor_id: 1
            };
            await usuariosParametrosValoresResolver.getUsuarioParametroValorById(testParams.usuario_parametro_valor_id);
            expect(usuariosParametrosValoresService.getUsuarioParametroValorById).toHaveBeenCalled();
        });
    });

});