import { registerEnumType } from '@nestjs/graphql';
import { Test } from '@nestjs/testing';
import { Estado } from '@prisma/client';
import { TbTipoUsuariosResolver } from './tipousuarios.resolver';
import { TbTipoUsuariosService } from './tipousuarios.service';

registerEnumType(Estado, {
    name: 'Estado'
})

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
                        createTipoUsuarios: jest.fn(),
                        updateTipoUsuarios: jest.fn(),
                        deleteTipoUsuarios: jest.fn()
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

    describe('Mutation createTipoUsuarios()', () => {
        it('should invoke TipoUsuariosService.createTipoUsuarios', async () => {
            const testParams = {
                nombre: "Andres"
            };

            await TipoUsuariosResolver.createTipoUsuarios(testParams);
            expect(TipoUsuariosService.createTipoUsuarios).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation updateTipoUsuarios()', () => {
        it('should invoke TipoUsuariosService.updateTipoUsuarios', async () => {
            const testParams = {
                tipo_usuario_id: 1,
                nombre: "Andres",
                Estado: "ACTIVO",

            };
            await TipoUsuariosResolver.updateTipoUsuarios(testParams);
            expect(TipoUsuariosService.updateTipoUsuarios).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation deleteTipoUsuarios()', () => {
        it('should invoke TipoUsuariosService.deleteTipoUsuarios', async () => {
            const testParams = {
                tipo_usuario_id: 1
            };
            await TipoUsuariosResolver.deleteTipoUsuarios(testParams.tipo_usuario_id);
            expect(TipoUsuariosService.deleteTipoUsuarios).toHaveBeenCalled();
        });
    });
});