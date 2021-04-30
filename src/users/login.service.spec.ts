import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma.service';
import { LoginService } from './login.service';


describe('Login Service', () => {
    let loginService: LoginService;
    let prismaService: PrismaService;
    let auditService: AuditService;

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
                LoginService, AuditService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        login: {
                            findFirst: jest.fn(() => {
                                return { salt: String }
                            }),
                            usernameExists: jest.fn(() => null),
                            findMany: jest.fn(() => null),
                            findUnique: jest.fn(),
                            create: jest.fn(() => {
                                return {
                                    id: Number,
                                };
                            }),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                        users: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                        audits: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn()
                        },
                    }),
                },
            ],
        }).compile();

        loginService = module.get<LoginService>(LoginService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getLogin method', () => {
        it('should invoke prismaService.login.findMany', async () => {
            await loginService.getLogin();
            expect(prismaService.login.findMany).toHaveBeenCalled();
        });
    });

    describe('getLoginById method', () => {
        it('should invoke prismaService.login.findUnique', async () => {
            const testParams = {
                login_id: 1
            };
            await loginService.getLoginById(
                testParams.login_id
            );
            expect(prismaService.login.findUnique).toHaveBeenCalled();
        });
    });

    describe('getUserById method', () => {
        it('should invoke prismaService.users.findUnique', async () => {
            const testParams = {
                id: 1
            };
            await loginService.getUserById(
                testParams.id
            );
            expect(prismaService.users.findUnique).toHaveBeenCalled();
        });
    });

    describe('usernameExists method', () => {
        it('should invoke prismaService.login.findMany', async () => {
            const testParams = {
                username: "usuario1"
            };
            await loginService.usernameExists(
                testParams.username
            );
            expect(prismaService.login.findMany).toHaveBeenCalled();
        });
    })

    describe('signInLogin method', () => {
        it('should invoke prismaService.login.findFirst', async () => {
            const testParams = {
                data: {
                    username: "usuario1",
                    pasword: "123456"
                }
            };
            await loginService.signInLogin(testParams.data);
            expect(prismaService.login.findFirst).toHaveBeenCalled();
        });
    })

    describe('signUpLogin method', () => {
        it('should invoke prismaService.login.create', async () => {
            const testParams = {
                data: {
                    username: null,
                    password: "123456",
                    salt: "",
                    token: "",
                    role_id: 3
                }
            };
            await loginService.signUpLogin(
                testParams.data,
            );
            expect(prismaService.login.create).toHaveBeenCalled();
        });
    });

    describe('createToken method', () => {
        it('should invoke prismaService.login.update', async () => {
            const testParams = {
                token: "wewewewewe",
                user: { id: 1 }
            };
            await loginService.createToken(
                testParams.token,
                testParams.user
            );
            expect(prismaService.login.update).toHaveBeenCalled();
        });
    });

})
