import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { RolesPermisosService } from './rolespermisos.service';


describe('RolesPermissions Service', () => {
    let rolePermissionService: RolesPermisosService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                RolesPermisosService,
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

        rolePermissionService = module.get<RolesPermisosService>(RolesPermisosService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getRolesPermissions method', () => {
        it('should invoke prismaService.roles_permissions.findMany', async () => {
            await rolePermissionService.getRolesPermisos();
            expect(prismaService.rolesPermisos.findMany).toHaveBeenCalled();
        });
    });

})
