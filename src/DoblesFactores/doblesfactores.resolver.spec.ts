import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { RolesService } from '../Admin/Roles/roles.service';
import { AuditoriasService } from '../Auditorias/auditorias.service';
import { LoginService } from '../Login/login.service';
import { PrismaService } from '../prisma.service';
import { DoblesFactoresResolver } from './doblesfactores.resolver';
import { DoblesFactoresService } from './doblesfactores.service';

describe('Dobles factores Resolver', () => {
    let twofactorResolver: DoblesFactoresResolver;
    let twofactorService: DoblesFactoresService;

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
                DoblesFactoresResolver, LoginService, AuditoriasService, PrismaService, RolesService,
                {
                    provide: DoblesFactoresService,
                    useFactory: () => ({
                        getDobleFactorById: jest.fn(),
                        createDobleFactor: jest.fn(),
                        configDobleFactor: jest.fn(),
                        getDobleFactorByLoginId: jest.fn(() => { return { config_twofactor: 1 } }),
                        exValidateRecoveryCode: jest.fn(() => true),
                        setActivateConfigDobleFactorTOTP: jest.fn(),
                        exValidateDobleFactorCode: jest.fn(() => { return { isCodeValid: true } }),
                        validationCodeMail: jest.fn()
                    }),
                },
            ],
        }).compile();

        twofactorResolver = module.get<DoblesFactoresResolver>(DoblesFactoresResolver);
        twofactorService = module.get<DoblesFactoresService>(DoblesFactoresService);
    });

    describe('Query getTwoFactorById()', () => {
        it('should invoke twofactorService.getTwoFactorById()', async () => {
            const testParams = {
                twofactor_id: 1
            };
            await twofactorResolver.getDobleFactorById(testParams.twofactor_id);
            expect(twofactorService.getDobleFactorById).toHaveBeenCalled();
        });
    });

    describe('Mutation createTwoFactor()', () => {
        it('should invoke twofactorService.createTwoFactor with arguments', async () => {
            const testParams = {
                login_id: 1,
                metodo_validacion_id: 1
            };
            await twofactorResolver.createDobleFactor(testParams);
            expect(twofactorService.createDobleFactor).toHaveBeenCalledWith(testParams);
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

    describe('Query exValidateDobleFactorCode()', () => {
        it('should invoke twofactorService.exValidateDobleFactorCode()', async () => {
            const testParams = {
                login_id: 1,
                codigo: "4457875454"
            };

            await twofactorResolver.exValidateDobleFactorCode(testParams);
            expect(twofactorService.exValidateDobleFactorCode).toHaveBeenCalled();
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
                login_id: 1,
                codigo_recuperacion: "4457875454"
            };

            await twofactorResolver.exValidateRecoveryCode(testParams);
            expect(twofactorService.exValidateRecoveryCode).toHaveBeenCalled();
        });
    });

    describe('Query validationCodeMail()', () => {
        it('should invoke twofactorService.validationCodeMail()', async () => {
            const testParams = {
                login_id: 1,
                codigo_validacion: "4457875454"
            };

            await twofactorResolver.exValidationCodeMail(testParams);
            expect(twofactorService.validationCodeMail).toHaveBeenCalled();
        });
    });
});