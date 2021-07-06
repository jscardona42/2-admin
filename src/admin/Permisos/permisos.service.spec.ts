import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { EntidadesService } from '../Entidades/entidades.service';
import { PermisosService } from './permisos.service';


describe('Permission Service', () => {
    let permisosService: PermisosService;
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
                        permisos: {
                            findFirst: jest.fn(() => { return { permiso: { permiso_id: 1 } } }),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                        entidades: {
                            findFirst: jest.fn(() => { return { entidad_id: 1 } }),
                        },
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

    // describe('createPermisos method', () => {
    //     it('should invoke prismaService.permisos.create', async () => {
    //         const testParams = {
    //             cls: [
    //                 {
    //                     permiso: 'RolePermissionResolver',
    //                     permiso_id: 1,
    //                     is_public: false
    //                 }
    //             ]
    //         };
    //         await permisosService.createPermisos(
    //             testParams.cls
    //         );
    //         expect(prismaService.permisos.create).toHaveBeenCalled();
    //     });
    // });

})
