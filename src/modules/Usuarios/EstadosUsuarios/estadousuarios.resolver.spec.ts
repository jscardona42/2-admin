import { registerEnumType } from '@nestjs/graphql';
import { Test } from '@nestjs/testing';
import { Estado } from '@prisma/client';
import { TbEstadosUsuariosResolver } from './estadosusuarios.resolver';
import { TbEstadosUsuariosService } from './estadosusuarios.service';

registerEnumType(Estado, {
    name: 'Estado'
})

describe('Iconos Resolver', () => {
    let EstadosUsuariosResolver: TbEstadosUsuariosResolver;
    let EstadosUsuariosService: TbEstadosUsuariosService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TbEstadosUsuariosResolver,
                {
                    provide: TbEstadosUsuariosService,
                    useFactory: () => ({
                        getEstadosUsuarios: jest.fn(),
                        getEstadosUsuariosById: jest.fn(),
                        getFilterEstadosUsuarios: jest.fn(),
                        createEstadosUsuarios: jest.fn(),
                        updateEstadosUsuarios: jest.fn(),
                        deleteEstadosUsuarios: jest.fn()
                    }),
                },
            ],
        }).compile();

        EstadosUsuariosResolver = module.get<TbEstadosUsuariosResolver>(TbEstadosUsuariosResolver);
        EstadosUsuariosService = module.get<TbEstadosUsuariosService>(TbEstadosUsuariosService);
    });

    describe('Query getEstadosUsuarios()', () => {
        it('should invoke EstadosUsuariosService.getEstadosUsuarios()', async () => {
            await EstadosUsuariosResolver.getEstadosUsuarios();
            expect(EstadosUsuariosService.getEstadosUsuarios).toHaveBeenCalled();
        });
    });

    describe('Query getTipoUsuarioById()', () => {
        it('should invoke TipoUsuariosService.getTipoUsuarioById', async () => {
            const testParams = {
                estado_usuario_id: 1
            };
            await EstadosUsuariosResolver.getEstadosUsuariosById(testParams.estado_usuario_id);
            expect(EstadosUsuariosService.getEstadosUsuariosById).toHaveBeenCalled();
        });
    });

    describe('Query getFilterEstadosUsuarios()', () => {
        it('should invoke EstadosUsuariosService.getFilterEstadosUsuarios()', async () => {
            const testParams = {
                nombre: "Andres"
            };
            await EstadosUsuariosResolver.getFilterEstadosUsuarios(testParams);
            expect(EstadosUsuariosService.getFilterEstadosUsuarios).toHaveBeenCalled();
        });
    });

    describe('Mutation createEstadosUsuarios()', () => {
        it('should invoke EstadosUsuariosService.createEstadosUsuarios', async () => {
            const testParams = {
                nombre: "Andres"
            };

            await EstadosUsuariosResolver.createEstadosUsuarios(testParams);
            expect(EstadosUsuariosService.createEstadosUsuarios).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation updateEstadosUsuarios()', () => {
        it('should invoke EstadosUsuariosService.updateEstadosUsuarios', async () => {
            const testParams = {
                estado_usuario_id: 1,
                nombre: "Andres",

            };
            await EstadosUsuariosResolver.updateEstadosUsuarios(testParams);
            expect(EstadosUsuariosService.updateEstadosUsuarios).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation deleteEstadosUsuarios()', () => {
        it('should invoke EstadosUsuariosService.deleteEstadosUsuarios', async () => {
            const testParams = {
                estado_usuario_id: 1
            };
            await EstadosUsuariosResolver.deleteEstadosUsuarios(testParams.estado_usuario_id);
            expect(EstadosUsuariosService.deleteEstadosUsuarios).toHaveBeenCalled();
        });
    });
});