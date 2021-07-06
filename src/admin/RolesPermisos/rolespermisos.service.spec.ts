import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { RolesPermisosService } from './rolespermisos.service';


describe('RolesPermissions Service', () => {
    let rolesPermisosService: RolesPermisosService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                RolesPermisosService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        rolesPermisos: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn()
                        },
                    }),
                },
            ],
        }).compile();

        rolesPermisosService = module.get<RolesPermisosService>(RolesPermisosService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getRolesPermisos method', () => {
        it('should invoke prismaService.roles_permissions.findMany', async () => {
            await rolesPermisosService.getRolesPermisos();
            expect(prismaService.rolesPermisos.findMany).toHaveBeenCalled();
        });
    });

})
