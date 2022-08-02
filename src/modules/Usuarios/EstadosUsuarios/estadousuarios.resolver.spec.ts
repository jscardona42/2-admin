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
                        getEstadoUsuarioById: jest.fn(),
                        getFilterEstadosUsuarios: jest.fn(),
                        createEstadoUsuario: jest.fn(),
                        updateEstadoUsuario: jest.fn(),
                        deleteEstadoUsuario: jest.fn()
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
            await EstadosUsuariosResolver.getEstadoUsuarioById(testParams.estado_usuario_id);
            expect(EstadosUsuariosService.getEstadoUsuarioById).toHaveBeenCalled();
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

    describe('Mutation createEstadoUsuario()', () => {
        it('should invoke EstadosUsuariosService.createEstadoUsuario', async () => {
            const testParams = {
                nombre: "Andres"
            };

            await EstadosUsuariosResolver.createEstadoUsuario(testParams);
            expect(EstadosUsuariosService.createEstadoUsuario).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation updateEstadoUsuario()', () => {
        it('should invoke EstadosUsuariosService.updateEstadoUsuario', async () => {
            const testParams = {
                estado_usuario_id: 1,
                nombre: "Andres",

            };
            await EstadosUsuariosResolver.updateEstadoUsuario(testParams);
            expect(EstadosUsuariosService.updateEstadoUsuario).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation deleteEstadoUsuario()', () => {
        it('should invoke EstadosUsuariosService.deleteEstadoUsuario', async () => {
            const testParams = {
                estado_usuario_id: 1
            };
            await EstadosUsuariosResolver.deleteEstadoUsuario(testParams.estado_usuario_id);
            expect(EstadosUsuariosService.deleteEstadoUsuario).toHaveBeenCalled();
        });
    });
});