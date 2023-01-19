import { Test } from '@nestjs/testing';
import { UsuariosSesionesResolver } from './usuariossesiones.resolver';
import { UsuariosSesionesService } from './usuariossesiones.service';

describe('UsuariosParametros Resolver', () => {
    let usuariosSesionesResolver: UsuariosSesionesResolver;
    let usuariosSesionesService: UsuariosSesionesService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsuariosSesionesResolver,
                {
                    provide: UsuariosSesionesService,
                    useFactory: () => ({
                        getUsuariosSesiones: jest.fn(),
                        getUsuarioSesionById: jest.fn(),
                    }),
                },
            ],
        }).compile();

        usuariosSesionesResolver = module.get<UsuariosSesionesResolver>(UsuariosSesionesResolver);
        usuariosSesionesService = module.get<UsuariosSesionesService>(UsuariosSesionesService);
    });

    describe('Query getUsuariosSesiones()', () => {
        it('should invoke usuariosSesionesService.getUsuariosSesiones()', async () => {
            await usuariosSesionesResolver.getUsuariosSesiones();
            expect(usuariosSesionesService.getUsuariosSesiones).toHaveBeenCalled();
        });
    });

    describe('Query getUsuarioSesionById()', () => {
        it('should invoke usuariosSesionesService.getUsuarioSesionById', async () => {
            const testParams = {
                usuario_sesion_id: 1
            };
            await usuariosSesionesResolver.getUsuarioSesionById(testParams.usuario_sesion_id);
            expect(usuariosSesionesService.getUsuarioSesionById).toHaveBeenCalled();
        });
    });

});