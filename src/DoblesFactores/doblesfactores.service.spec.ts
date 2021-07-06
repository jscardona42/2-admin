import { MailerModule } from '@nestjs-modules/mailer';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { LoginService } from '../Login/login.service';
import { AuditoriasService } from '../Auditorias/auditorias.service';
import { DoblesFactores } from './entities/doblesfactores.entity';
import { DoblesFactoresService } from './doblesfactores.service';


describe('Twofactor Service', () => {
    let twofactorService: DoblesFactoresService;
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
                DoblesFactoresService, MailerModule, LoginService, AuditoriasService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        twofactor: {
                            findFirst: jest.fn(() => { return { twofactor_id: 1 } }),
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
                    }),
                },
            ],
        }).compile();

        twofactorService = module.get<DoblesFactoresService>(DoblesFactoresService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getTwoFactorById method', () => {
        it('should invoke prismaService.twofactor.findUnique', async () => {
            const testParams = {
                twofactor_id: 1
            };
            await twofactorService.getDobleFactorById(
                testParams.twofactor_id
            );
            expect(prismaService.doblesFactores.findUnique).toHaveBeenCalled();
        });
    });

    describe('getTwoFactorByLoginId method', () => {
        it('should invoke prismaService.twofactor.findFirst', async () => {
            const testParams = {
                login_id: 1
            };
            await twofactorService.getDobleFactorByLoginId(
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
            const data = await twofactorService.generateDobleFactorAuthenticationSecret(testParams.user);
            expect(data).toStrictEqual(expect.objectContaining({
                secret: expect.any(String),
                otpauthUrl: expect.any(String),
            }));
        });
    });

    describe('createTwoFactor', () => {
        it('should create twofactor', async () => {
            const testParams = {
                login_id: 1,
                metodo_validacion_id: 1
            };
            await twofactorService.createDobleFactor(testParams);
            expect(prismaService.doblesFactores.update).toHaveBeenCalled();
        });
    });

    describe('configTwoFactor', () => {
        it('should configTwoFactor', async () => {
            const testParams = {
                login_id: 1,
                secret: "aserefdfdass"
            };
            await twofactorService.configDobleFactor(testParams.secret, testParams.login_id);
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
            await twofactorService.exSetActivateConfigTwofactorTOTP(testParams);
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
            const data = await twofactorService.exValidateDobleFactorCode(testParams.data, testParams.doblesfactores);
            expect(data).toStrictEqual(false);
        });
    });

    describe('validateRecoveryCode', () => {
        it('should validateRecoveryCode', async () => {
            const testParams = {
                login_id: 1,
                codigo_recuperacion: "5474457"
            };
            await twofactorService.exValidateRecoveryCode(testParams);
            expect(prismaService.doblesFactores.findFirst).toHaveBeenCalled();
        });
    });

    describe('sendCodeMail', () => {
        it('should sendCodeMail', async () => {
            const testParams = {
                user: { email: "code@gmail.com" },
                twofactor: {
                    login_id: 1,
                    doble_factor_id: 1,
                    esta_configurado: true,
                    otplib_secreta: "ddfdfdf0",
                    codigo_recuperacion: "101044545",
                    fecha_creacion_codigo: new Date(),
                    metodo_validacion_id: 1
                }, login: {
                    salt: "$2b$10$6TF0Rmnmmq9Ch60QcmbfIu"
                }
            };
            await twofactorService.sendCodeMail(testParams.user, testParams.twofactor, testParams.login);
            expect(prismaService.doblesFactores.update).toHaveBeenCalled();
        });
    });

    describe('validationCodeMail', () => {
        it('should validationCodeMail', async () => {
            const testParams = {
                data: { validate_code: "4485454" },
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
            await twofactorService.validationCodeMail(testParams.data, testParams.login, testParams.twofactor);
            expect(prismaService.doblesFactores.findFirst).toHaveBeenCalled();
        });
    });

});