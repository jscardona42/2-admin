import { MailerModule } from '@nestjs-modules/mailer';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { DoblesFactores } from './entities/doblesfactores.entity';
import { DoblesFactoresService } from './doblesfactores.service';
import { RolesService } from '../GestionFuncionalidades/Roles/roles.service';
import { UsuariosService } from '../Usuarios/usuarios.service';
import { configDoblesFactoresInput, DoblesFactoresValidarInput } from './dto/doblesfactores.dto';
import { PermisosService } from '../GestionFuncionalidades/Permisos/permisos.service';
import { EntidadesService } from '../Admin/Entidades/entidades.service';
import { ValidacionesService } from '../Admin/Validaciones/validaciones.service';
import { FuncionalidadesService } from '../GestionFuncionalidades/Funcionalidades/funcionalidades.service';


describe('Doble factor Service', () => {
    let doblesFactoresService: DoblesFactoresService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: {
                        expiresIn: process.env.JWT_EXPIRESIN
                    }
                }),
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
            ],
            providers: [
                DoblesFactoresService, MailerModule, RolesService, PermisosService, EntidadesService, ValidacionesService, UsuariosService, FuncionalidadesService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        doblesFactores: {
                            findFirst: jest.fn(() => { return { doble_factor_id: 1, metodo_validacion: "TOTP" } }),
                            findMany: jest.fn(),
                            findUnique: jest.fn(() => { return { doble_factor_id: 1, metodo_validacion: "TOTP" } }),
                            create: jest.fn(() => {
                                return {
                                    id: Number,
                                };
                            }),
                            update: jest.fn(() => "ewewererer"),
                            delete: jest.fn(),
                        },
                        usuarios: {
                            findUnique: jest.fn(() => { return { usuario_id: 1 } }),
                        },
                        permisos: {
                            findFirst: jest.fn(() => { return { permiso: { permiso_id: 1 } } }),
                        },
                        entidades: {
                            findFirst: jest.fn(() => { return { entidad: { entidad_id: 1 } } }),
                        }
                    }),
                },
            ],
        }).compile();

        doblesFactoresService = module.get<DoblesFactoresService>(DoblesFactoresService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getDobleFactorById method', () => {
        it('should invoke prismaService.doblesFactores.findUnique', async () => {
            const testParams = {
                twofactor_id: 1
            };
            await doblesFactoresService.getDobleFactorById(
                testParams.twofactor_id
            );
            expect(prismaService.doblesFactores.findUnique).toHaveBeenCalled();
        });
    });

    describe('getDobleFactorByLoginId method', () => {
        it('should invoke prismaService.doblesFactores.findFirst', async () => {
            const testParams = {
                usuario_id: 1
            };
            await doblesFactoresService.getDobleFactorByLoginId(
                testParams.usuario_id
            );
            expect(prismaService.doblesFactores.findFirst).toHaveBeenCalled();
        });
    });

    describe('generateTwoFactorAuthenticationSecret method', () => {
        it('should invoke generateTwoFactorAuthenticationSecret', async () => {
            const testParams = {
                user: { email: "jscardona42@gmail.com" }
            };
            const data = await doblesFactoresService.generateDobleFactorAuthenticationSecret(testParams.user);
            expect(data).toStrictEqual(expect.objectContaining({
                secret: expect.any(String),
                otpauthUrl: expect.any(String),
            }));
        });
    });

    describe('createDobleFactor', () => {
        it('should createDobleFactor', async () => {
            const testParams: configDoblesFactoresInput = {
                usuario_id: 1,
                metodo_validacion: "EMAIL"
            };
            await doblesFactoresService.createDobleFactor(testParams);
            expect(prismaService.doblesFactores.update).toHaveBeenCalled();
        });
    });

    describe('configDobleFactor', () => {
        it('should configDobleFactor', async () => {
            const testParams = {
                usuario_id: 1,
                secret: "aserefdfdass"
            };
            await doblesFactoresService.configDobleFactor(testParams.secret, testParams.usuario_id);
            expect(prismaService.doblesFactores.update).toHaveBeenCalled();
        });
    });

    describe('setActivateConfigTwofactorTOTP', () => {
        it('should setActivateConfigTwofactorTOTP', async () => {
            const testParams: DoblesFactores = {
                usuario_id: 1,
                doble_factor_id: 1,
                esta_configurado: true,
                otplib_secreta: "ddfdfdf0",
                codigo_recuperacion: "101044545",
                fecha_creacion_codigo: new Date(),
                metodo_validacion: "TOTP"
            };
            await doblesFactoresService.exSetActivateConfigTwofactorTOTP(testParams);
            expect(prismaService.doblesFactores.update).toHaveBeenCalled();
        });
    });

    describe('exValidateTwoFactorCode', () => {
        it('should exValidateTwoFactorCode', async () => {
            const testParams: DoblesFactoresValidarInput = {
                codigo: "145454s",
                usuario_id: 1
            };
            const doblesFactores = {
                usuario_id: 1,
                doble_factor_id: 1,
                esta_configurado: true,
                otplib_secreta: "ddfdfdf0",
                codigo_recuperacion: "101044545",
                metodo_validacion: "EMAIL"
            }
            const data = await doblesFactoresService.exValidateDobleFactorCode(testParams, doblesFactores);
            expect(data).toStrictEqual(false);
        });
    });

    describe('validateRecoveryCode', () => {
        it('should validateRecoveryCode', async () => {
            const testParams = {
                usuario_id: 1,
                codigo_recuperacion: "5474457"
            };
            await doblesFactoresService.exValidateRecoveryCode(testParams);
            expect(prismaService.doblesFactores.findFirst).toHaveBeenCalled();
        });
    });

    // describe('sendCodeMail', () => {
    //     it('should sendCodeMail', async () => {
    //         const testParams = {
    //             user: { email: "jscardona42@gmail.com" },
    //             twofactor: {
    //                 usuario_id: 1,
    //                 doble_factor_id: 1,
    //                 esta_configurado: true,
    //                 otplib_secreta: "ddfdfdf0",
    //                 codigo_recuperacion: "101044545",
    //                 fecha_creacion_codigo: new Date(),
    //                 metodo_validacion: "EMAIL"
    //             }, usuario: {
    //                 salt: "$2b$10$6TF0Rmnmmq9Ch60QcmbfIu"
    //             }
    //         };
    //         await doblesFactoresService.sendCodeMail(testParams.usuario, testParams.twofactor);
    //         expect(prismaService.doblesFactores.update).toHaveBeenCalled();
    //     });
    // });

    describe('validationCodeMail', () => {
        it('should validationCodeMail', async () => {
            const testParams = {
                data: { codigo_validacion: "4485454" },
                twofactor: {
                    usuario_id: 1,
                    twofactor_id: 1,
                    config_twofactor: 1,
                    twofactor_secret: "ddfdfdf0",
                    recovery_code: "101044545",
                    time_creation_code: new Date(),
                    validation_method_id: 2
                }, login: {
                    salt: "$2b$10$6TF0Rmnmmq9Ch60QcmbfIu"
                }
            };
            await doblesFactoresService.validationCodeMail(testParams.data, testParams.login, testParams.twofactor);
            expect(prismaService.doblesFactores.findFirst).toHaveBeenCalled();
        });
    });

});
