
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { MicroserviciosService } from './microservicios.service';


describe('Microservicios Service', () => {
    let prismaService: PrismaService;
    let microserviciosService: MicroserviciosService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                MicroserviciosService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        microservicios: {
                            findFirst: jest.fn(),
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

        microserviciosService = module.get<MicroserviciosService>(MicroserviciosService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getMicroservicios method', () => {
        it('should invoke prismaService.microservicios.findMany', async () => {
            await microserviciosService.getMicroservicios();
            expect(prismaService.microservicios.findMany).toHaveBeenCalled();
        });
    });

    describe('getMicroservicioById method', () => {
        it('should invoke prismaService.microservicios.findUnique', async () => {
            const testParams = {
                microservicio_id: 1
            };
            await microserviciosService.getMicroservicioById(
                testParams.microservicio_id
            );
            expect(prismaService.microservicios.findUnique).toHaveBeenCalled();
        });
    });

    describe('getFilterMicroservicios method', () => {
        it('should invoke prismaService.microservicios.findMany', async () => {
            const testParams = {
                nombre: "a"
            };
            await microserviciosService.getFilterMicroservicios(testParams.nombre);
            expect(prismaService.microservicios.findMany).toHaveBeenCalled();
        });
    });


    describe('createMicroservicio method', () => {
        it('should invoke prismaService.microservicios.create', async () => {
            var testParams = {
                data: {
                    name: "Nombre",
                    hostname: "a",
                    puerto: 3000,
                    url: "",
                    activo: true
                }
            }
            await microserviciosService.createMicroservicio(testParams.data);
            expect(prismaService.microservicios.create).toHaveBeenCalled();
        });
    });

    describe('updateMicroservicio method', () => {
        it('should invoke prismaService.microservicios.update', async () => {
            var testParams = {
                data: {
                    name: "Nombre",
                    hostname: "a",
                    puerto: 3000,
                    url: "",
                    activo: true,
                    microservicio_id: 1
                }
            }
            await microserviciosService.updateMicroservicio(testParams.data);
            expect(prismaService.microservicios.update).toHaveBeenCalled();
        });
    });

    describe('deleteMicroservicio method', () => {
        it('should invoke prismaService.microservicios.delete', async () => {
            const testParams = {
                microservicio_id: 1
            };
            await microserviciosService.deleteMicroservicio(testParams.microservicio_id);
            expect(prismaService.microservicios.delete).toHaveBeenCalled();
        });
    });

})