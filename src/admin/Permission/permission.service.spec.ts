import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { PermissionPrincipalService } from '../PermissionPrincipal/permissionprincipal.service';
import { PermissionService } from './permission.service';


describe('Permission Service', () => {
    let permissionService: PermissionService;
    let permissionPrincipalService: PermissionPrincipalService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                PermissionService,
                PermissionPrincipalService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        permissions: {
                            findFirst: jest.fn(() => { return { permissions: { permissions_id: 1 } } }),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                        permissions_principal: {
                            findFirst: jest.fn(() => { return { permission_principal_id: 1 } }),
                        },
                    }),
                },
            ],
        }).compile();

        permissionService = module.get<PermissionService>(PermissionService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getPermissions method', () => {
        it('should invoke prismaService.permissions.findMany', async () => {
            await permissionService.getPermissions();
            expect(prismaService.permissions.findMany).toHaveBeenCalled();
        });
    });

    describe('createPermissions method', () => {
        it('should invoke prismaService.permissions.update', async () => {
            const testParams = {
                cls: [
                    {
                        name: 'RolePermissionResolver',
                        permissions: 'getRolesPermissions',
                        is_public: false
                    }
                ]
            };
            await permissionService.createPermissions(
                testParams.cls
            );
            expect(prismaService.permissions.update).toHaveBeenCalled();
        });
    });

})
