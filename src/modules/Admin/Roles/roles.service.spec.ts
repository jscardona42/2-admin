import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { EntidadesService } from '../Entidades/entidades.service';
import { PermisosService } from '../Permisos/permisos.service';
import { ValidacionesService } from '../Validaciones/validaciones.service';
import { CreateRolInput, UpdateRolInput } from './dto/roles.dto';
import { RolesService } from './roles.service';


describe('Roles Service', () => {
    let roleService: RolesService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                RolesService, PermisosService, EntidadesService, ValidacionesService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        roles: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            update: jest.fn(),
                            create: jest.fn(),
                            delete: jest.fn(),
                        },
                        rolesPermisos: {
                            findUnique: jest.fn(() => { return { rol_permiso_id: 12, rol_id: 4 } }),
                            findFirst: jest.fn(() => { return null }),
                        },
                        permisos: {
                            findFirst: jest.fn(() => { return { permiso: { permiso_id: 155 } } }),
                            findUnique: jest.fn(() => { return { permiso: { permiso_id: 150 } } }),
                        },
                    }),
                },
            ],
        }).compile();

        roleService = module.get<RolesService>(RolesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getRoles method', () => {
        it('should invoke prismaService.roles.findMany', async () => {
            await roleService.getRoles();
            expect(prismaService.roles.findMany).toHaveBeenCalled();
        });
    });

    describe('getRolById method', () => {
        it('should invoke prismaService.roles.findUnique', async () => {
            const testParams = {
                rol_id: 1
            };
            await roleService.getRolById(testParams.rol_id);
            expect(prismaService.roles.findUnique).toHaveBeenCalled();
        });
    });

    describe('getFilterRoles method', () => {
        it('should invoke prismaService.roles.findMany', async () => {
            const testParams = {
                rol: "a"
            };
            await roleService.getFilterRoles(testParams.rol);
            expect(prismaService.roles.findMany).toHaveBeenCalled();
        });
    });


    describe('createRol method', () => {
        it('should invoke prismaService.roles.create', async () => {
            var testParams: CreateRolInput = {
                rol: "",
                RolesPermisos: [
                    { permiso_id: 1 }
                ]
            }
            await roleService.createRol(testParams);
            expect(prismaService.roles.create).toHaveBeenCalled();
        });
    });

    describe('updateRol method', () => {
        it('should invoke prismaService.roles.update', async () => {
            var testParams: UpdateRolInput = {
                rol: "Nombre",
                rol_id: 4,
                RolesPermisos: {
                    rol_permiso_id: 12, permiso_id: 150
                }
            }
            await roleService.updateRol(testParams);
            expect(prismaService.roles.update).toHaveBeenCalled();
        });
    });

    describe('deleteRol method', () => {
        it('should invoke prismaService.roles.delete', async () => {
            const testParams = {
                rol_id: 1
            };
            await roleService.deleteRol(testParams.rol_id);
            expect(prismaService.roles.delete).toHaveBeenCalled();
        });
    });

})
