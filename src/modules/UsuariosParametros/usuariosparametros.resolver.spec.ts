import { Test } from '@nestjs/testing';
import { UsuariosParametrosResolver } from './usuariosparametros.resolver';
import { UsuariosParametrosService } from './usuariosparametros.service';

describe('UsuariosParametros Resolver', () => {
    let usuariosParametrosResolver: UsuariosParametrosResolver;
    let usuariosParametrosService: UsuariosParametrosService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsuariosParametrosResolver,
                {
                    provide: UsuariosParametrosService,
                    useFactory: () => ({
                        getUsuariosParametros: jest.fn(),
                        getUsuarioParametroById: jest.fn(),
                        getFilterUsuariosParametrosInput: jest.fn(),
                        createUsuarioParametro: jest.fn(),
                        updateUsuarioParametro: jest.fn(),
                    }),
                },
            ],
        }).compile();

        usuariosParametrosResolver = module.get<UsuariosParametrosResolver>(UsuariosParametrosResolver);
        usuariosParametrosService = module.get<UsuariosParametrosService>(UsuariosParametrosService);
    });

    describe('Query getUsuariosParametros()', () => {
        it('should invoke usuariosParametrosService.getUsuariosParametros()', async () => {
            await usuariosParametrosResolver.getUsuariosParametros();
            expect(usuariosParametrosService.getUsuariosParametros).toHaveBeenCalled();
        });
    });

    describe('Query getUsuarioParametroById()', () => {
        it('should invoke usuariosParametrosService.getUsuarioParametroById', async () => {
            const testParams = {
                usuario_parametro_id: 1
            };
            await usuariosParametrosResolver.getUsuarioParametroById(testParams.usuario_parametro_id);
            expect(usuariosParametrosService.getUsuarioParametroById).toHaveBeenCalled();
        });
    });

    describe('Query getFilterUsuariosParametrosInput()', () => {
        it('should invoke usuariosParametrosService.getFilterUsuariosParametrosInput()', async () => {
            const testParams = {
                nombre: "test"
            };
            await usuariosParametrosResolver.getFilterUsuariosParametrosInput(testParams);
            expect(usuariosParametrosService.getFilterUsuariosParametrosInput).toHaveBeenCalled();
        });
    });

    describe('Mutation createUsuarioParametro()', () => {
        it('should invoke usuariosParametrosService.createUsuarioParametro', async () => {
            const testParams = {
                nombre: "test",
                alias: "test",
                requerido: true,
                valor_defecto: "test",
                descripcion: "test"
            };

            await usuariosParametrosResolver.createUsuarioParametro(testParams);
            expect(usuariosParametrosService.createUsuarioParametro).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation updateUsuarioParametro()', () => {
        it('should invoke usuariosParametrosService.updateUsuarioParametro', async () => {
            const testParams = {
                usuario_parametro_id: 1,
                nombre: "test",
                alias: "test",
                requerido: true,
                valor_defecto: "test",
                descripcion: "test"
            };
            await usuariosParametrosResolver.updateUsuarioParametro(testParams);
            expect(usuariosParametrosService.updateUsuarioParametro).toHaveBeenCalledWith(testParams);
        });
    });
});