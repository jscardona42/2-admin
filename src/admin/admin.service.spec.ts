import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma.service';
import { AdminService } from './admin.service';


describe('Admin Service', () => {
    let adminService: AdminService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                AdminService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        permissions: {
                            findFirst: jest.fn(() => {
                                return { moduleData: Boolean }
                            }),
                            usernameExists: jest.fn(() => {
                                return false;
                            }),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(() => {
                                return {
                                    id: Number,
                                };
                            }),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                        roles: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                        roles_permissions: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn()
                        },
                    }),
                },
            ],
        }).compile();

        adminService = module.get<AdminService>(AdminService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getPermissions method', () => {
        it('should invoke prismaService.permissions.findMany', async () => {
            await adminService.getPermissions();
            expect(prismaService.permissions.findMany).toHaveBeenCalled();
        });
    });

    describe('getRoles method', () => {
        it('should invoke prismaService.roles.findMany', async () => {
            await adminService.getRoles();
            expect(prismaService.roles.findMany).toHaveBeenCalled();
        });
    });

    describe('getMethods method', () => {
        it('should invoke string', async () => {
            const testParams = {
                TMPmethods: ['getPermissions', 'getRoles', 'getRolesPermissions'],
                clsname: "AdminResolver"
            };
            const admin = await adminService.getMethods(testParams.TMPmethods, testParams.clsname);
            expect(admin).toEqual("{\"status\":200}");
        });
    });

    describe('createPermissions method', () => {
        it('should invoke prismaService.permissions.update', async () => {
            const testParams = {
                cls: [
                    {
                        nameClass: 'LoginResolver',
                        methods: ['getLogin', 'getLoginById', 'signInLogin', 'signUpLogin']
                    }
                ]
            };
            await adminService.createPermissions(
                testParams.cls
            );
            expect(prismaService.permissions.update).toHaveBeenCalled();
        });
    });

    describe('getRolesPermissions method', () => {
        it('should invoke prismaService.roles_permissions.findMany', async () => {
            await adminService.getRolesPermissions();
            expect(prismaService.roles_permissions.findMany).toHaveBeenCalled();
        });
    });

})
