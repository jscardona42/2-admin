import { MailerModule } from '@nestjs-modules/mailer';
import { Test } from '@nestjs/testing';
import { LoginService } from '../users/login.service';
import { PrismaService } from '../prisma.service';
import { TwofactorService } from './twofactor.service';
import { JwtModule } from '@nestjs/jwt';
import { AuditService } from '../audit/audit.service';
import { Twofactor } from './twofactor.entity';
import { Login } from 'src/users/login.entity';

describe('Twofactor Service', () => {
    let twofactorService: TwofactorService;
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
                TwofactorService, MailerModule, LoginService, AuditService,
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

        twofactorService = module.get<TwofactorService>(TwofactorService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getTwoFactorById method', () => {
        it('should invoke prismaService.twofactor.findUnique', async () => {
            const testParams = {
                twofactor_id: 1
            };
            await twofactorService.getTwoFactorById(
                testParams.twofactor_id
            );
            expect(prismaService.twofactor.findUnique).toHaveBeenCalled();
        });
    });

    describe('getTwoFactorByLoginId method', () => {
        it('should invoke prismaService.twofactor.findFirst', async () => {
            const testParams = {
                login_id: 1
            };
            await twofactorService.getTwoFactorByLoginId(
                testParams.login_id
            );
            expect(prismaService.twofactor.findFirst).toHaveBeenCalled();
        });
    });

    describe('generateTwoFactorAuthenticationSecret method', () => {
        it('should invoke generateTwoFactorAuthenticationSecret', async () => {
            const testParams = {
                user: { email: "jscardona42@gmail.com" }
            };
            const data = await twofactorService.generateTwoFactorAuthenticationSecret(testParams.user);
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
                validation_method_id: 1
            };
            await twofactorService.createTwoFactor(testParams);
            expect(prismaService.twofactor.create).toHaveBeenCalled();
        });
    });

    describe('configTwoFactor', () => {
        it('should configTwoFactor', async () => {
            const testParams = {
                login_id: 1,
                secret: "aserefdfdass"
            };
            await twofactorService.configTwoFactor(testParams.secret, testParams.login_id);
            expect(prismaService.twofactor.update).toHaveBeenCalled();
        });
    });

    describe('setActivateConfigTwofactorTOTP', () => {
        it('should setActivateConfigTwofactorTOTP', async () => {
            const testParams: Twofactor = {
                login_id: 1,
                twofactor_id: 1,
                config_twofactor: 1,
                twofactor_secret: "ddfdfdf0",
                recovery_code: "101044545",
                time_creation_code: new Date(),
                validation_method_id: 1
            };
            await twofactorService.setActivateConfigTwofactorTOTP(testParams);
            expect(prismaService.twofactor.update).toHaveBeenCalled();
        });
    });

    describe('validateTwoFactorCode', () => {
        it('should validateTwoFactorCode', async () => {
            const testParams = {
                data: { login_id: 1, code: "eeffff111" },
                twofactor: {
                    login_id: 1,
                    twofactor_id: 1,
                    config_twofactor: 1,
                    twofactor_secret: "ddfdfdf0",
                    recovery_code: "101044545",
                    time_creation_code: new Date(),
                    validation_method_id: 1
                }
            };
            const data = await twofactorService.validateTwoFactorCode(testParams.data, testParams.twofactor);
            expect(data).toStrictEqual(false);
        });
    });

    describe('validateRecoveryCode', () => {
        it('should validateRecoveryCode', async () => {
            const testParams = {
                twofactor_id: 1,
                recovery_code: "5474457"
            };
            await twofactorService.validateRecoveryCode(testParams);
            expect(prismaService.twofactor.findFirst).toHaveBeenCalled();
        });
    });

    describe('sendCodeMail', () => {
        it('should sendCodeMail', async () => {
            const testParams = {
                user: { email: "code@gmail.com" },
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
            await twofactorService.sendCodeMail(testParams.user, testParams.twofactor, testParams.login);
            expect(prismaService.twofactor.update).toHaveBeenCalled();
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
            expect(prismaService.twofactor.findFirst).toHaveBeenCalled();
        });
    });

});
