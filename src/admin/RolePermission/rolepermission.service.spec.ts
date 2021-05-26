import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { RolePermissionService } from './rolepermission.service';


describe('RolesPermissions Service', () => {
    let rolePermissionService: RolePermissionService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                RolePermissionService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
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

        rolePermissionService = module.get<RolePermissionService>(RolePermissionService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getRolesPermissions method', () => {
        it('should invoke prismaService.roles_permissions.findMany', async () => {
            await rolePermissionService.getRolesPermissions();
            expect(prismaService.roles_permissions.findMany).toHaveBeenCalled();
        });
    });

})
