import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { EntidadesService } from '../Entidades/entidades.service';
import { PermisosService } from '../Permisos/permisos.service';
import { RolesService } from '../Roles/roles.service';
import { ValidacionesService } from '../Validaciones/validaciones.service';
import { RolesPermisosService } from './rolespermisos.service';


describe('RolesPermissions Service', () => {
    let rolesPermisosService: RolesPermisosService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                RolesPermisosService, RolesService, PermisosService, EntidadesService, ValidacionesService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        rolesPermisos: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            createMany: jest.fn(() => {
                                return { datos: { count: 2 } };
                            }),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                        roles: {
                            findUnique: jest.fn(() => {
                                return { rol_id: 1 };
                            }),
                        },
                        permisos: {
                            findUnique: jest.fn(() => {
                                return { permiso_id: 2 };
                            }),
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

    describe('getRolPermisoById method', () => {
        it('should invoke prismaService.rolesPermisos.findUnique', async () => {
            const testParams = {
                rol_permiso_id: 1
            };
            await rolesPermisosService.getRolPermisoById(
                testParams.rol_permiso_id
            );
            expect(prismaService.rolesPermisos.findUnique).toHaveBeenCalled();
        });
    });

    describe('createRolPermiso method', () => {
        it('should invoke prismaService.rolesPermisos.create', async () => {
            var testParams = {
                data: {
                    data: [{ rol_id: 1, permiso_id: 1, }]
                }
            }
            await rolesPermisosService.createRolPermiso(testParams.data);
            expect(prismaService.rolesPermisos.createMany).toHaveBeenCalled();
        });
    });

    describe('updateRolPermiso method', () => {
        it('should invoke prismaService.rolesPermisos.update', async () => {
            var testParams = {
                data: {
                    rol_id: 1,
                    permiso_id: 2,
                    rol_permiso_id: 1
                }
            }
            await rolesPermisosService.updateRolPermiso(testParams.data);
            expect(prismaService.rolesPermisos.update).toHaveBeenCalled();
        });
    });

    describe('deleteRolPermiso method', () => {
        it('should invoke prismaService.rolesPermisos.delete', async () => {
            const testParams = {
                rol_permiso_id: 1
            };
            await rolesPermisosService.deleteRolPermiso(testParams.rol_permiso_id);
            expect(prismaService.rolesPermisos.delete).toHaveBeenCalled();
        });
    });

})
