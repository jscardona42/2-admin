import { Test } from '@nestjs/testing';
import { SignInUserInput, SignUpUserInput } from './dto/usuarios.dto';
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
                        signUpLogin: jest.fn(),
                        signInLogin: jest.fn(),
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

    describe('Query signInLogin)', () => {
        it('should invoke usuariosService.signInLogin', async () => {
            const testParams: SignInUserInput = {
                username: "usuario1",
                password: "12345"
            };
            await usuariosResolver.signInLogin(testParams);
            expect(usuariosService.signInLogin).toHaveBeenCalled();
        });
    });


    describe('Mutation signUpLogin()', () => {
        it('should invoke usuariosService.signUpLogin', async () => {
            let testParams: SignUpUserInput;
            await usuariosResolver.signUpLogin(testParams);
            expect(usuariosService.signUpLogin).toHaveBeenCalledWith(testParams);
        });
    });

});