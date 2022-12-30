
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { SignInUserInput, ValidationCodeVerificationInput } from './dto/usuarios.dto';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsuariosService } from './usuarios.service';
import { PerfilesService } from '../Perfiles/perfiles.service';
import { FormulariosEmpresasService } from '../FormulariosEmpresas/formulariosempresas.service';


describe('Usuarios Service', () => {
    let prismaService: PrismaService;
    let usuariosService: UsuariosService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                MailerModule.forRoot({
                    transport: {
                        host: process.env.HOST_MAILER,
                        port: process.env.PORT_MAILER,
                        auth: {
                            user: process.env.USER_MAILER,
                            pass: process.env.PASSWORD_MAILER
                        },
                    }
                }),
                JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: {
                        expiresIn: process.env.JWT_EXPIRESIN
                    }
                }),
            ],
            providers: [
                UsuariosService, MailerModule,
                PerfilesService, FormulariosEmpresasService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        usuarios: {
                            findFirst: jest.fn(() => {
                                return { salt: String, correo: "andresfc-916@hotmail.com", TbEstadosUsuarios: { nombre: "Juan" } }
                            }),
                            findUnique: jest.fn(() => {
                                return { correo: "andresfc-96@hotmail.com", salt: String }
                            }),
                            usernameExists: jest.fn(() => { return { usernameExists: false } }),
                            findMany: jest.fn(() => { return { usernameExists: false } }),
                            create: jest.fn(() => {
                                return {
                                    id: Number,
                                };
                            }),
                            update: jest.fn(() => { return { usernameExists: false } }),
                            delete: jest.fn(() => { return { usernameExists: false } }),
                        },
                        usuariosParametros: {
                            findFirst: jest.fn(() => { return { usuario_parametro_id: 1 } }),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn()
                        },
                        usuariosParametrosValores: {
                            findFirst: jest.fn(() => { return { usuario_parametro_valor_id: 1 } }),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn()
                        },
                        usuariosHistoricoContrasenas: {
                            findFirst: jest.fn(() => { return { usu_historico_contrasena_id: 1 } }),
                            findMany: jest.fn(() => { return [{ usu_historico_contrasena_id: 1 }] }),
                            findUnique: jest.fn(),
                            create: jest.fn()
                        },
                        perfiles:{
                            findUnique: jest.fn()
                        }
                    }),
                },
            ],
        }).compile();

        usuariosService = module.get<UsuariosService>(UsuariosService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getUsuarios method', () => {
        it('should invoke prismaService.usuarios.findMany', async () => {
            await usuariosService.getUsuarios();
            expect(prismaService.usuarios.findMany).toHaveBeenCalled();
        });
    });

    describe('getUsuarioById method', () => {
        it('should invoke prismaService.usuarios.findUnique', async () => {
            const testParams = {
                usuario_id: 1
            };
            await usuariosService.getUsuarioById(
                testParams.usuario_id
            );
            expect(prismaService.usuarios.findUnique).toHaveBeenCalled();
        });
    });

    describe('getFilterUsuarios method', () => {
        it('should invoke prismaService.usuarios.findMany', async () => {
            const testParams = {
                email: "a",
                nombre: "a"
            };
            await usuariosService.getFilterUsuarios(
                testParams.email, testParams.nombre
            );
            expect(prismaService.usuarios.findMany).toHaveBeenCalled();
        });
    });

    describe('signInUser method', () => {
        it('should invoke prismaService.usuarios.findFirst', async () => {
            let testParams: SignInUserInput = {
                contrasena: "12121",
                nombre_usuario: "usuario2"
            }
            await usuariosService.signInLogin(testParams);
            expect(prismaService.usuarios.findFirst).toHaveBeenCalled();
        });
    });

    // describe('exChangePasswordLogin method', () => {
    //     it('should invoke prismaService.usuarios.findFirst', async () => {
    //         let testParams: ChangePasswordInput = {
    //             usuario_id: 7,
    //             contrasena: "1234",
    //             nueva_contrasena: "12345"
    //         }
    //         await usuariosService.exChangePasswordLogin(testParams);
    //         expect(prismaService.usuarios.findFirst).toHaveBeenCalled();
    //     });
    // });

    // describe('exSendCodeVerification method', () => {
    //     it('should invoke prismaService.usuarios.findFirst', async () => {
    //         let testParams: SendCodeVerificationInput = {
    //             nombre_usuario: "Andres"
    //         }
    //         await usuariosService.exSendCodeVerification(testParams);
    //         expect(prismaService.usuarios.findFirst).toHaveBeenCalled();
    //     });
    // });

    describe('exValidationCodeVerification method', () => {
        it('should invoke prismaService.usuariosParametrosValores.findFirst', async () => {
            let testParams: ValidationCodeVerificationInput = {
                codigo: "1234",
                usuario_id: 7
            }
            await usuariosService.exValidationCodeVerification(testParams);
            expect(prismaService.usuariosParametrosValores.findFirst).toHaveBeenCalled();
        });
    });

    // describe('signUpLogin method', () => {
    //     it('should invoke prismaService.usuarios.create', async () => {
    //         let testParams: SignUpUserInput = {
    //             correo: "usuario@gmail.com",
    //             nombre_usuario: "Johan Cardona",
    //             rol_id: 1,
    //             estado_usuario_id: 1,
    //             tipo_usuario_id: 1
    //         }
    //         await usuariosService.signUpLogin(testParams);
    //         expect(prismaService.usuarios.create).toHaveBeenCalled();
    //     });
    // });
})