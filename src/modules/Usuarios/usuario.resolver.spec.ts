import { Test } from '@nestjs/testing';
import { CreateUsuarioInput, UpdateUsuarioInput } from './dto/usuarios.dto';
import { UsuariosResolver } from './usuarios.resolver';
import { UsuariosService } from './usuarios.service';


describe('Iconos Resolver', () => {
    let usuariosResolver: UsuariosResolver;
    let usuariosService: UsuariosService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsuariosResolver,
                {
                    provide: UsuariosService,
                    useFactory: () => ({
                        getUsuarios: jest.fn(),
                        getUsuarioById: jest.fn(),
                        getFilterUsuarios: jest.fn(),
                        createUsuario: jest.fn(),
                        updateUsuario: jest.fn(),
                        deleteUsuario: jest.fn()
                    }),
                },
            ],
        }).compile();

        usuariosResolver = module.get<UsuariosResolver>(UsuariosResolver);
        usuariosService = module.get<UsuariosService>(UsuariosService);
    });

    describe('Query getUsuarios()', () => {
        it('should invoke usuariosService.getUsuarios()', async () => {
            await usuariosResolver.getUsuarios();
            expect(usuariosService.getUsuarios).toHaveBeenCalled();
        });
    });

    describe('Query getUsuarioById()', () => {
        it('should invoke usuariosService.getUsuarioById', async () => {
            const testParams = {
                usuario_id: 1
            };
            await usuariosResolver.getUsuarioById(testParams.usuario_id);
            expect(usuariosService.getUsuarioById).toHaveBeenCalled();
        });
    });

    describe('Query getFilterUsuarios()', () => {
        it('should invoke usuariosService.getFilterUsuarios()', async () => {
            const testParams = {
                email: "a",
                nombre: "a"
            };
            await usuariosResolver.getFilterUsuarios(testParams.email, testParams.nombre);
            expect(usuariosService.getFilterUsuarios).toHaveBeenCalled();
        });
    });

    describe('Mutation createUsuario()', () => {
        it('should invoke usuariosService.createUsuario', async () => {
            var testParams: CreateUsuarioInput;
            await usuariosResolver.createUsuario(testParams);
            expect(usuariosService.createUsuario).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation updateUsuario()', () => {
        it('should invoke usuariosService.updateUsuario', async () => {
            var testParams: UpdateUsuarioInput;
            await usuariosResolver.updateUsuario(testParams);
            expect(usuariosService.updateUsuario).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation deleteUsuario()', () => {
        it('should invoke usuariosService.deleteUsuario', async () => {
            var testParams = {
                usuario_id: 1
            };
            await usuariosResolver.deleteUsuario(testParams.usuario_id);
            expect(usuariosService.deleteUsuario).toHaveBeenCalled();
        });
    });
});