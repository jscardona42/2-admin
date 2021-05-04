import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { AuditService } from '../audit/audit.service';
import { LoginService } from '../users/login.service';
import { TwofactorResolver } from './twofactor.resolver';
import { TwofactorService } from './twofactor.service';

describe('Login Resolver', () => {
    let twofactorResolver: TwofactorResolver;
    let twofactorService: TwofactorService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: {
                        expiresIn: process.env.JWT_EXPIRESIN
                    }
                }),
            ],
            providers: [
                TwofactorResolver, LoginService, AuditService, PrismaService,
                {
                    provide: TwofactorService,
                    useFactory: () => ({
                        getTwoFactorById: jest.fn(),
                        createTwoFactor: jest.fn(),
                        configTwoFactor: jest.fn(),
                        getTwoFactorByLoginId: jest.fn(() => { return { config_twofactor: 1 } }),
                        validateTwoFactorCode: jest.fn(() => true),
                        setActivateConfigTwofactorTOTP: jest.fn(),
                        validateRecoveryCode: jest.fn(),
                        validationCodeMail:jest.fn()
                    }),
                },
            ],
        }).compile();

        twofactorResolver = module.get<TwofactorResolver>(TwofactorResolver);
        twofactorService = module.get<TwofactorService>(TwofactorService);
    });

    describe('Query getTwoFactorById()', () => {
        it('should invoke twofactorService.getTwoFactorById()', async () => {
            const testParams = {
                twofactor_id: 1
            };
            await twofactorResolver.getTwoFactorById(testParams.twofactor_id);
            expect(twofactorService.getTwoFactorById).toHaveBeenCalled();
        });
    });

    describe('Mutation createTwoFactor()', () => {
        it('should invoke twofactorService.createTwoFactor with arguments', async () => {
            const testParams = {
                login_id: 1,
                validation_method_id: 1
            };
            await twofactorResolver.createTwoFactor(testParams);
            expect(twofactorService.createTwoFactor).toHaveBeenCalledWith(testParams);
        });
    });

    // describe('Query configTwoFactor()', () => {
    //     it('should invoke twofactorService.configTwoFactor()', async () => {
    //         const testParams = {
    //             login_id: 1
    //         };

    //         await twofactorResolver.configTwoFactor(testParams.login_id);
    //         expect(twofactorService.configTwoFactor).toHaveBeenCalled();
    //     });
    // });

    describe('Query validateTwoFactorCode()', () => {
        it('should invoke twofactorService.validateTwoFactorCode()', async () => {
            const testParams = {
                login_id: 1,
                code: "4457875454"
            };

            await twofactorResolver.validateTwoFactorCode(testParams);
            expect(twofactorService.validateTwoFactorCode).toHaveBeenCalled();
        });
    });

    // describe('Mutation setActivateConfigTwofactorTOTP()', () => {
    //     it('should invoke twofactorService.setActivateConfigTwofactorTOTP with arguments', async () => {
    //         const testParams = {
    //             login_id: 1,
    //         };
    //         await twofactorResolver.setActivateConfigTwofactorTOTP(testParams.login_id);
    //         expect(twofactorService.setActivateConfigTwofactorTOTP).toHaveBeenCalledWith(testParams.login_id);
    //     });
    // });

    describe('Query validateRecoveryCode()', () => {
        it('should invoke twofactorService.validateRecoveryCode()', async () => {
            const testParams = {
                twofactor_id: 1,
                recovery_code: "4457875454"
            };

            await twofactorResolver.validateRecoveryCode(testParams);
            expect(twofactorService.validateRecoveryCode).toHaveBeenCalled();
        });
    });

    describe('Query validationCodeMail()', () => {
        it('should invoke twofactorService.validationCodeMail()', async () => {
            const testParams = {
                login_id: 1,
                validate_code: "4457875454"
            };

            await twofactorResolver.validationCodeMail(testParams);
            expect(twofactorService.validationCodeMail).toHaveBeenCalled();
        });
    });
});