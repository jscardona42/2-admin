
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { ValidacionesService } from './validaciones.service';


describe('Iconos Service', () => {
    let prismaService: PrismaService;
    let validacionesService: ValidacionesService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ValidacionesService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        validaciones: {
                            findFirst: jest.fn(() => { return [{ validacion_id: 2 }] }),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            upsert: jest.fn(),
                            create: jest.fn(),
                            createMany: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                        permisosValidaciones: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                            createMany: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                        microservicios: {
                            findFirst: jest.fn(() => { return { microservicio_id: 2 } }),
                        },
                        permisos: {
                            findMany: jest.fn(() => { return { permiso_id: 2 } }),
                        }
                    }),
                },
            ],
        }).compile();

        validacionesService = module.get<ValidacionesService>(ValidacionesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getValidaciones method', () => {
        it('should invoke prismaService.validaciones.findMany', async () => {
            await validacionesService.getValidaciones();
            expect(prismaService.validaciones.findMany).toHaveBeenCalled();
        });
    });

    describe('getPermisosValidaciones method', () => {
        it('should invoke prismaService.validaciones.findMany', async () => {
            await validacionesService.getPermisosValidaciones();
            expect(prismaService.permisosValidaciones.findMany).toHaveBeenCalled();
        });
    });

    describe('getValidacioneById method', () => {
        it('should invoke prismaService.validaciones.findUnique', async () => {
            const testParams = {
                validacion_id: 1
            };
            await validacionesService.getValidacionById(
                testParams.validacion_id
            );
            expect(prismaService.validaciones.findUnique).toHaveBeenCalled();
        });
    });

    describe('getPermisoValidacionById method', () => {
        it('should invoke prismaService.permisosValidaciones.findUnique', async () => {
            const testParams = {
                permiso_validacion_id: 1
            };
            await validacionesService.getPermisoValidacionById(
                testParams.permiso_validacion_id
            );
            expect(prismaService.permisosValidaciones.findUnique).toHaveBeenCalled();
        });
    });


    // describe('createValidacion method', () => {
    //     it('should invoke prismaService.validaciones.create', async () => {
    //         var testParams = {
    //             permisos: [{ permiso_id: 2 }],
    //             id_referenciado: 'centroTrabajoIdReferenciaRrhh',
    //             resolver: {
    //                 nameClass: 'BodegasResolver',
    //                 methods: [
    //                     'getBodegas',
    //                     'getBodegaById',
    //                     'createBodega',
    //                     'updateBodega',
    //                     'deleteBodega',
    //                     'centroTrabajoIdReferenciaRrhh'
    //                 ]
    //             }
    //         }
    //         await validacionesService.createValidacion(testParams);
    //         expect(prismaService.validaciones.update).toHaveBeenCalled();
    //     });
    // });

    describe('updateValidacion method', () => {
        it('should invoke prismaService.validaciones.update', async () => {
            var testParams = {
                data: {
                    microservicio_id: 2,
                    validacion_id: 1
                }
            }
            await validacionesService.updateValidacion(testParams.data);
            expect(prismaService.validaciones.update).toHaveBeenCalled();
        });
    });

    describe('deleteValidacion method', () => {
        it('should invoke prismaService.validaciones.delete', async () => {
            const testParams = {
                validacion_id: 1
            };
            await validacionesService.deleteValidacion(testParams.validacion_id);
            expect(prismaService.validaciones.delete).toHaveBeenCalled();
        });
    });

})