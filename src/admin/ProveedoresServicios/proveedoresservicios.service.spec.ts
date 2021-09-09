
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { ProveedoresServiciosService } from './proveedoresservicios.service';


describe('Proveedores servicios Service', () => {
    let prismaService: PrismaService;
    let proveedoresServiciosService: ProveedoresServiciosService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ProveedoresServiciosService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        proveedoresServicios: {
                            findFirst: jest.fn(() => { return { proveedor_servicio_id: 1 } }),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                            createMany: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        }
                    }),
                },
            ],
        }).compile();

        proveedoresServiciosService = module.get<ProveedoresServiciosService>(ProveedoresServiciosService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getProveedoresServicios method', () => {
        it('should invoke prismaService.proveedoresServicios.findMany', async () => {
            await proveedoresServiciosService.getProveedoresServicios();
            expect(prismaService.proveedoresServicios.findMany).toHaveBeenCalled();
        });
    });

    describe('getProveedorServicioById method', () => {
        it('should invoke prismaService.proveedoresServicios.findUnique', async () => {
            const testParams = {
                pro_ser_id: 1
            };
            await proveedoresServiciosService.getProveedorServicioById(testParams.pro_ser_id);
            expect(prismaService.proveedoresServicios.findUnique).toHaveBeenCalled();
        });
    });

    describe('saveProveedoresServicios method', () => {
        it('should invoke prismaService.proveedoresServicios.update', async () => {
            const testParams = {
                microservicio_id: 1,
                myProviders: []
            };
            await proveedoresServiciosService.saveProveedoresServicios(testParams.microservicio_id, testParams.myProviders);
            expect(prismaService.proveedoresServicios.update).toHaveBeenCalled();
        });
    });

    describe('deleteProveedorServicio method', () => {
        it('should invoke prismaService.proveedoresServicios.delete', async () => {
            const testParams = {
                pro_ser_id: 1
            };
            await proveedoresServiciosService.deleteProveedorServicio(testParams.pro_ser_id);
            expect(prismaService.proveedoresServicios.delete).toHaveBeenCalled();
        });
    });

})