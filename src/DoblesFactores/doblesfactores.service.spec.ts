import { MailerModule } from '@nestjs-modules/mailer';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { LoginService } from '../Login/login.service';
import { AuditoriasService } from '../Auditorias/auditorias.service';
import { DoblesFactores } from './entities/doblesfactores.entity';
import { DoblesFactoresService } from './doblesfactores.service';
import { MetodosValidacionService } from '../Admin/MetodosValidacion/metodosvalidacion.service';
import { RolesService } from '../Admin/Roles/roles.service';


describe('Twofactor Service', () => {
    let doblesFactores: DoblesFactoresService;
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
                DoblesFactoresService, MailerModule, LoginService, AuditoriasService, MetodosValidacionService, LoginService, RolesService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        doblesFactores: {
                            findFirst: jest.fn(() => { return { doble_factor_id: 1 } }),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(() => {
                                return {
                                    id: Number,
                                };
                            }),
                            update: jest.fn(() => "ewewererer"),
                            delete: jest.fn(),
                        },
                        login: {
                            findUnique: jest.fn(() => { return { login_id: 1 } }),
                        },
                        metodosValidacion: {
                            findUnique: jest.fn(() => { return { metodo_validacion: 1 } })
                        },
                    }),
                },
            ],
        }).compile();

        doblesFactores = module.get<DoblesFactoresService>(DoblesFactoresService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getDobleFactorById method', () => {
        it('should invoke prismaService.doblesFactores.findUnique', async () => {
            const testParams = {
                twofactor_id: 1
            };
            await doblesFactores.getDobleFactorById(
                testParams.twofactor_id
            );
            expect(prismaService.doblesFactores.findUnique).toHaveBeenCalled();
        });
    });

    describe('getDobleFactorByLoginId method', () => {
        it('should invoke prismaService.doblesFactores.findFirst', async () => {
            const testParams = {
                login_id: 1
            };
            await doblesFactores.getDobleFactorByLoginId(
                testParams.login_id
            );
            expect(prismaService.doblesFactores.findFirst).toHaveBeenCalled();
        });
    });

    describe('generateTwoFactorAuthenticationSecret method', () => {
        it('should invoke generateTwoFactorAuthenticationSecret', async () => {
            const testParams = {
                user: { email: "jscardona42@gmail.com" }
            };
            const data = await doblesFactores.generateDobleFactorAuthenticationSecret(testParams.user);
            expect(data).toStrictEqual(expect.objectContaining({
                secret: expect.any(String),
                otpauthUrl: expect.any(String),
            }));
        });
    });

    describe('createDobleFactor', () => {
        it('should createDobleFactor', async () => {
            const testParams = {
                login_id: 1,
                metodo_validacion_id: 1
            };
            await doblesFactores.createDobleFactor(testParams);
            expect(prismaService.doblesFactores.update).toHaveBeenCalled();
        });
    });

    describe('configDobleFactor', () => {
        it('should configDobleFactor', async () => {
            const testParams = {
                login_id: 1,
                secret: "aserefdfdass"
            };
            await doblesFactores.configDobleFactor(testParams.secret, testParams.login_id);
            expect(prismaService.doblesFactores.update).toHaveBeenCalled();
        });
    });

    describe('setActivateConfigTwofactorTOTP', () => {
        it('should setActivateConfigTwofactorTOTP', async () => {
            const testParams: DoblesFactores = {
                login_id: 1,
                doble_factor_id: 1,
                esta_configurado: true,
                otplib_secreta: "ddfdfdf0",
                codigo_recuperacion: "101044545",
                fecha_creacion_codigo: new Date(),
                metodo_validacion_id: 1
            };
            await doblesFactores.exSetActivateConfigTwofactorTOTP(testParams);
            expect(prismaService.doblesFactores.update).toHaveBeenCalled();
        });
    });

    describe('validateTwoFactorCode', () => {
        it('should validateTwoFactorCode', async () => {
            const testParams = {
                data: { login_id: 1, codigo: "eeffff111" },
                doblesfactores: {
                    login_id: 1,
                    doble_factor_id: 1,
                    esta_configurado: true,
                    otplib_secreta: "ddfdfdf0",
                    codigo_recuperacion: "101044545",
                    fecha_creacion_codigo: new Date(),
                    metodo_validacion_id: 1
                }
            };
            const data = await doblesFactores.exValidateDobleFactorCode(testParams.data, testParams.doblesfactores);
            expect(data).toStrictEqual(false);
        });
    });

    describe('validateRecoveryCode', () => {
        it('should validateRecoveryCode', async () => {
            const testParams = {
                login_id: 1,
                codigo_recuperacion: "5474457"
            };
            await doblesFactores.exValidateRecoveryCode(testParams);
            expect(prismaService.doblesFactores.findFirst).toHaveBeenCalled();
        });
    });

    describe('sendCodeMail', () => {
        it('should sendCodeMail', async () => {
            const testParams = {
                user: { email: "usuario1@gmail.com" },
                twofactor: {
                    login_id: 1,
                    doble_factor_id: 1,
                    esta_configurado: true,
                    otplib_secreta: "ddfdfdf0",
                    codigo_recuperacion: "101044545",
                    fecha_creacion_codigo: new Date(),
                    metodo_validacion_id: 2
                }, login: {
                    salt: "$2b$10$6TF0Rmnmmq9Ch60QcmbfIu"
                }
            };
            await doblesFactores.sendCodeMail(testParams.user, testParams.twofactor, testParams.login);
            expect(prismaService.doblesFactores.update).toHaveBeenCalled();
        });
    });

    describe('validationCodeMail', () => {
        it('should validationCodeMail', async () => {
            const testParams = {
                data: { codigo_validacion: "4485454" },
                twofactor: {
                    login_id: 1,
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
            await doblesFactores.validationCodeMail(testParams.data, testParams.login, testParams.twofactor);
            expect(prismaService.doblesFactores.findFirst).toHaveBeenCalled();
        });
    });

});
