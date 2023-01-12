import { Test } from '@nestjs/testing';
import { TbTipoUsuariosResolver } from './tipousuarios.resolver';
import { TbTipoUsuariosService } from './tipousuarios.service';

describe('Iconos Resolver', () => {
    let TipoUsuariosResolver: TbTipoUsuariosResolver;
    let TipoUsuariosService: TbTipoUsuariosService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TbTipoUsuariosResolver,
                {
                    provide: TbTipoUsuariosService,
                    useFactory: () => ({
                        getTipoUsuarios: jest.fn(),
                        getTipoUsuarioById: jest.fn(),
                        getFilterTipoUsuarios: jest.fn(),
                        createTipoUsuario: jest.fn(),
                        updateTipoUsuario: jest.fn(),
                        deleteTipoUsuario: jest.fn()
                    }),
                },
            ],
        }).compile();

        TipoUsuariosResolver = module.get<TbTipoUsuariosResolver>(TbTipoUsuariosResolver);
        TipoUsuariosService = module.get<TbTipoUsuariosService>(TbTipoUsuariosService);
    });

    describe('Query getTipoUsuarios()', () => {
        it('should invoke TipoUsuariosService.getTipoUsuarios()', async () => {
            await TipoUsuariosResolver.getTipoUsuarios();
            expect(TipoUsuariosService.getTipoUsuarios).toHaveBeenCalled();
        });
    });

    describe('Query getTipoUsuarioById()', () => {
        it('should invoke TipoUsuariosService.getTipoUsuarioById', async () => {
            const testParams = {
                tipo_usuario_id: 1
            };
            await TipoUsuariosResolver.getTipoUsuarioById(testParams.tipo_usuario_id);
            expect(TipoUsuariosService.getTipoUsuarioById).toHaveBeenCalled();
        });
    });

    describe('Query getFilterTipoUsuarios()', () => {
        it('should invoke TipoUsuariosService.getFilterTipoUsuarios()', async () => {
            const testParams = {
                nombre: "Andres"
            };
            await TipoUsuariosResolver.getFilterTipoUsuarios(testParams);
            expect(TipoUsuariosService.getFilterTipoUsuarios).toHaveBeenCalled();
        });
    });

    describe('Mutation createTipoUsuario()', () => {
        it('should invoke TipoUsuariosService.createTipoUsuario', async () => {
            const testParams = {
                nombre: "Andres"
            };

            await TipoUsuariosResolver.createTipoUsuario(testParams);
            expect(TipoUsuariosService.createTipoUsuario).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation updateTipoUsuario()', () => {
        it('should invoke TipoUsuariosService.updateTipoUsuario', async () => {
            const testParams = {
                tipo_usuario_id: 1,
                nombre: "Andres",
                Estado: "ACTIVO",

            };
            await TipoUsuariosResolver.updateTipoUsuario(testParams);
            expect(TipoUsuariosService.updateTipoUsuario).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation deleteTipoUsuario()', () => {
        it('should invoke TipoUsuariosService.deleteTipoUsuario', async () => {
            const testParams = {
                tipo_usuario_id: 1
            };
            await TipoUsuariosResolver.deleteTipoUsuario(testParams.tipo_usuario_id);
            expect(TipoUsuariosService.deleteTipoUsuario).toHaveBeenCalled();
        });
    });
});