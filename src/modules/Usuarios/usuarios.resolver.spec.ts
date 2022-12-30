import { Test } from '@nestjs/testing';
import { ChangePasswordInput, CreateUsuarioInput, SendCodeVerificationInput, SignInUserInput, ValidationCodeVerificationInput } from './dto/usuarios.dto';

import { UsuariosResolver } from './usuarios.resolver';
import { UsuariosService } from './usuarios.service';


describe('Usuarios Resolver', () => {
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
                        signInLogin: jest.fn(),
                        exSendCodeVerification: jest.fn(),
                        exValidationCodeVerification: jest.fn(),
                        exChangePasswordLogin: jest.fn()
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
                nombre_usuario: "usuario1",
                contrasena: "12345"
            };
            await usuariosResolver.signInLogin(testParams);
            expect(usuariosService.signInLogin).toHaveBeenCalled();
        });
    });


    describe('Mutation signUpLogin()', () => {
        it('should invoke usuariosService.signUpLogin', async () => {
            let testParams: CreateUsuarioInput;
            await usuariosResolver.createUsuario(testParams);
            expect(usuariosService.createUsuario).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation exChangePasswordLogin()', () => {
        it('should invoke usuariosService.exChangePasswordLogin', async () => {
            let testParams: ChangePasswordInput;
            await usuariosResolver.exChangePasswordLogin(testParams);
            expect(usuariosService.exChangePasswordLogin).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation exSendCodeVerification()', () => {
        it('should invoke usuariosService.exSendCodeVerification', async () => {
            let testParams: SendCodeVerificationInput;
            await usuariosResolver.exSendCodeVerification(testParams);
            expect(usuariosService.exSendCodeVerification).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Query exValidationCodeVerification()', () => {
        it('should invoke usuariosService.exValidationCodeVerification', async () => {
            let testParams: ValidationCodeVerificationInput;
            await usuariosResolver.exValidationCodeVerification(testParams);
            expect(usuariosService.exValidationCodeVerification).toHaveBeenCalledWith(testParams);
        });
    });

});