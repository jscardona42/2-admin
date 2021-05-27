import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { EntidadesService } from '../Entidades/entidades.service';
import { PermisosService } from './permisos.service';


describe('Permission Service', () => {
    let permissionService: PermisosService;
    let entidadesService: EntidadesService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                PermisosService,
                EntidadesService,
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

        permissionService = module.get<PermisosService>(PermisosService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getPermissions method', () => {
        it('should invoke prismaService.permissions.findMany', async () => {
            await permissionService.getPermisos();
            expect(prismaService.permisos.findMany).toHaveBeenCalled();
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
            await permissionService.createPermisos(
                testParams.cls
            );
            expect(prismaService.permisos.update).toHaveBeenCalled();
        });
    });

})
