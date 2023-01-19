import { Test } from '@nestjs/testing';
import { UsuariosHistoricoContrasenasService } from './usuarioshistoricocontrasenas.service';
import { UsuariosHistoricoContrasenasResolver } from './usuarioshistoricocontrasenas.resolver';

describe('UsuariosParametros Resolver', () => {
    let usuariosHistoricoContrasenasResolver: UsuariosHistoricoContrasenasResolver;
    let usuariosHistoricoContrasenasService: UsuariosHistoricoContrasenasService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsuariosHistoricoContrasenasResolver,
                {
                    provide: UsuariosHistoricoContrasenasService,
                    useFactory: () => ({
                        getUsuariosHistoricoContrasenas: jest.fn(),
                        getUsuarioHistoricoContrasenaById: jest.fn(),
                    }),
                },
            ],
        }).compile();

        usuariosHistoricoContrasenasResolver = module.get<UsuariosHistoricoContrasenasResolver>(UsuariosHistoricoContrasenasResolver);
        usuariosHistoricoContrasenasService = module.get<UsuariosHistoricoContrasenasService>(UsuariosHistoricoContrasenasService);
    });

    describe('Query getUsuariosHistoricoContrasenas()', () => {
        it('should invoke usuariosHistoricoContrasenasService.getUsuariosHistoricoContrasenas()', async () => {
            await usuariosHistoricoContrasenasResolver.getUsuariosHistoricoContrasenas();
            expect(usuariosHistoricoContrasenasService.getUsuariosHistoricoContrasenas).toHaveBeenCalled();
        });
    });

    describe('Query getUsuarioHistoricoContrasenaById()', () => {
        it('should invoke usuariosHistoricoContrasenasService.getUsuarioHistoricoContrasenaById', async () => {
            const testParams = {
                usu_historico_contrasena_id: 1
            };
            await usuariosHistoricoContrasenasResolver.getUsuarioHistoricoContrasenaById(testParams.usu_historico_contrasena_id);
            expect(usuariosHistoricoContrasenasService.getUsuarioHistoricoContrasenaById).toHaveBeenCalled();
        });
    });

});