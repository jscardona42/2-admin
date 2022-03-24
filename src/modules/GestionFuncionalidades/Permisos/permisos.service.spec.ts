import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { EntidadesService } from '../../Admin/Entidades/entidades.service';
import { ValidacionesService } from '../../Admin/Validaciones/validaciones.service';
import { PermisosService } from './permisos.service';


describe('Permisos Service', () => {
    let permisosService: PermisosService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                PermisosService,
                {
                    provide: ValidacionesService,
                    useFactory: () => ({
                        createValidacion: jest.fn(((validacion) => { return { validacion_id: 1 } })),
                    }),
                },
                {
                    provide: EntidadesService,
                    useFactory: () => ({
                        createEntidad: jest.fn(((entidad) => { return { entidad_id: 1 } })),
                        getEntidadeById: jest.fn(((entidad_id) => { return { entidad_id: 1, nombre: "test" } })),
                        createEntidadExcluida: jest.fn(((entidad_id, validacion_id) => { return { entidad_id: 1, validacion_id: 1 } })),
                    }),
                },
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        permisos: {
                            findFirst: jest.fn(() => { return { permiso: { permiso_id: 1 } } }),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(((permiso) => { return { permiso_id: 1 } })),
                            update: jest.fn(((permiso) => { return { permiso_id: 1 } })),
                            delete: jest.fn(),
                        },
                        entidades: {
                            findFirst: jest.fn(() => { return { entidad_id: 1 } }),
                            findUnique: jest.fn(() => { return { entidad_id: 1 } }),
                        },
                        proveedoresServicios: {
                            findMany: jest.fn(() => {
                                return [
                                    {
                                        proveedor_servicio_id: 1,
                                        microservicio_id: 2,
                                        lista_proveedores: '[[{"nameClass":"LoginResolver","methods":["getLogin","getLoginById","signInLogin","signUpLogin","logOutLogin","exChangePasswordLogin"]}]]',
                                        lista_entidades_secundarias: '["MenusPalabrasSec","MenusTraduccionesSec","ProveedoresServiciosSec","PermisosValidacionesSec","RolesFuncionalidadesSec","ValidacionesSec","FuncionalidadesPermisosSec"]'
                                    }
                                ]
                            }),
                            findFirst: jest.fn(() => { return { entidad_id: 1 } }),
                        }
                    }),
                },
            ],
        }).compile();

        permisosService = module.get<PermisosService>(PermisosService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getPermisos method', () => {
        it('should invoke prismaService.permisos.findMany', async () => {
            await permisosService.getPermisos();
            expect(prismaService.permisos.findMany).toHaveBeenCalled();
        });
    });

    describe('getPermisoById method', () => {
        it('should invoke prismaService.permisos.findUnique', async () => {
            const testParams = {
                permiso_id: 1
            };
            await permisosService.getPermisoById(testParams.permiso_id);
            expect(prismaService.permisos.findUnique).toHaveBeenCalled();
        });
    });

    describe('getFilterPermisos method', () => {
        it('should invoke prismaService.permisos.findMany', async () => {
            const testParams = {
                permiso: "a"
            };
            await permisosService.getFilterPermisos(testParams.permiso);
            expect(prismaService.permisos.findMany).toHaveBeenCalled();
        });
    });

    describe('updatePermiso method', () => {
        it('should invoke prismaService.permisos.update', async () => {
            var testParams = {
                data: {
                    entidad_id: 1,
                    permiso: "a",
                    permiso_id: 1
                }
            }
            await permisosService.updatePermiso(testParams.data);
            expect(prismaService.permisos.update).toHaveBeenCalled();
        });
    });

    describe('deletePermiso method', () => {
        it('should invoke prismaService.permisos.delete', async () => {
            const testParams = {
                permiso_id: 1
            };
            await permisosService.deletePermiso(testParams.permiso_id);
            expect(prismaService.permisos.delete).toHaveBeenCalled();
        });
    });

    // describe('preparePermisos method', () => {
    //     it('should invoke prismaService.permisos.findMany', async () => {
    //         await permisosService.preparePermisos();
    //         expect(prismaService.proveedoresServicios.findMany).toHaveBeenCalled();
    //     });
    // });


    describe('createPermisos method', () => {
        it('should invoke prismaService.permisos.create', async () => {
            const testParams = {
                cls: [
                    {
                        permiso: 'RolePermissionResolver',
                        permiso_id: 1,
                        is_public: false
                    }
                ]
            };
            await permisosService.createPermisos(
                testParams.cls
            );
            expect(prismaService.permisos.update).toHaveBeenCalled();
        });
    });
})
