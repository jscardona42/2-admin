import { Test } from '@nestjs/testing';
import { ProveedoresServiciosResolver } from './proveedoresservicios.resolver';
import { ProveedoresServiciosService } from './proveedoresservicios.service';


describe('Proveedores servicios Resolver', () => {
    let proveedoresServiciosResolver: ProveedoresServiciosResolver;
    let proveedoresServiciosService: ProveedoresServiciosService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                ProveedoresServiciosResolver,
                {
                    provide: ProveedoresServiciosService,
                    useFactory: () => ({
                        getProveedoresServicios: jest.fn(),
                        getProveedorServicioById: jest.fn(),
                        deleteProveedorServicio: jest.fn()
                    }),
                },
            ],
        }).compile();

        proveedoresServiciosResolver = module.get<ProveedoresServiciosResolver>(ProveedoresServiciosResolver);
        proveedoresServiciosService = module.get<ProveedoresServiciosService>(ProveedoresServiciosService);
    });

    describe('Query getProveedoresServicios()', () => {
        it('should invoke proveedoresServiciosService.getProveedoresServicios()', async () => {
            await proveedoresServiciosResolver.getProveedoresServicios();
            expect(proveedoresServiciosService.getProveedoresServicios).toHaveBeenCalled();
        });
    });

    describe('Query getProveedorServicioById()', () => {
        it('should invoke proveedoresServiciosService.getProveedorServicioById', async () => {
            const testParams = {
                pro_ser_id: 1
            };
            await proveedoresServiciosResolver.getProveedorServicioById(testParams.pro_ser_id);
            expect(proveedoresServiciosService.getProveedorServicioById).toHaveBeenCalled();
        });
    });

    describe('Mutation deleteProveedorServicio()', () => {
        it('should invoke proveedoresServiciosService.deleteProveedorServicio', async () => {
            var testParams = {
                pro_ser_id: 1
            };
            await proveedoresServiciosResolver.deleteProveedorServicio(testParams.pro_ser_id);
            expect(proveedoresServiciosService.deleteProveedorServicio).toHaveBeenCalled();
        });
    });
});