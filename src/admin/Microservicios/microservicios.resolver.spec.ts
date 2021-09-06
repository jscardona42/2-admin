import { Test } from '@nestjs/testing';
import { CreateMicroservicioInput, UpdateMicroservicioInput } from './dto/microservicios.dto';
import { MicroserviciosResolver } from './microservicios.resolver';
import { MicroserviciosService } from './microservicios.service';


describe('Iconos Resolver', () => {
    let microserviciosResolver: MicroserviciosResolver;
    let microserviciosService: MicroserviciosService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                MicroserviciosResolver,
                {
                    provide: MicroserviciosService,
                    useFactory: () => ({
                        getMicroservicios: jest.fn(),
                        getMicroservicioById: jest.fn(),
                        getFilterMicroservicios: jest.fn(),
                        createMicroservicio: jest.fn(),
                        updateMicroservicio: jest.fn(),
                        deleteMicroservicio: jest.fn()
                    }),
                },
            ],
        }).compile();

        microserviciosResolver = module.get<MicroserviciosResolver>(MicroserviciosResolver);
        microserviciosService = module.get<MicroserviciosService>(MicroserviciosService);
    });

    describe('Query getMicroservicios()', () => {
        it('should invoke microserviciosService.getMicroservicios()', async () => {
            await microserviciosResolver.getMicroservicios();
            expect(microserviciosService.getMicroservicios).toHaveBeenCalled();
        });
    });

    describe('Query getMicroservicioById()', () => {
        it('should invoke microserviciosService.getMicroservicioById', async () => {
            const testParams = {
                microservicio_id: 1
            };
            await microserviciosResolver.getMicroservicioById(testParams.microservicio_id);
            expect(microserviciosService.getMicroservicioById).toHaveBeenCalled();
        });
    });

    describe('Query getFilterMicroservicios()', () => {
        it('should invoke microserviciosService.getFilterMicroservicios()', async () => {
            const testParams = {
                nombre: "a"
            };
            await microserviciosResolver.getFilterMicroservicios(testParams.nombre);
            expect(microserviciosService.getFilterMicroservicios).toHaveBeenCalled();
        });
    });

    describe('Mutation createMicroservicio()', () => {
        it('should invoke microserviciosService.createMicroservicio', async () => {
            var testParams: CreateMicroservicioInput;
            await microserviciosResolver.createMicroservicio(testParams);
            expect(microserviciosService.createMicroservicio).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation updateMicroservicio()', () => {
        it('should invoke microserviciosService.updateMicroservicio', async () => {
            var testParams: UpdateMicroservicioInput;
            await microserviciosResolver.updateMicroservicio(testParams);
            expect(microserviciosService.updateMicroservicio).toHaveBeenCalledWith(testParams);
        });
    });

    describe('Mutation deleteMicroservicio()', () => {
        it('should invoke microserviciosService.deleteMicroservicio', async () => {
            var testParams = {
                microservicio_id: 1
            };
            await microserviciosResolver.deleteMicroservicio(testParams.microservicio_id);
            expect(microserviciosService.deleteMicroservicio).toHaveBeenCalled();
        });
    });
});