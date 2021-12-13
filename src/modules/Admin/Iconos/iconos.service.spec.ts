
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { IconosService } from './iconos.service';


describe('Iconos Service', () => {
    let prismaService: PrismaService;
    let iconosService: IconosService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                IconosService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        iconos: {
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

        iconosService = module.get<IconosService>(IconosService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getIconos method', () => {
        it('should invoke prismaService.iconos.findMany', async () => {
            await iconosService.getIconos();
            expect(prismaService.iconos.findMany).toHaveBeenCalled();
        });
    });

    describe('getIconoById method', () => {
        it('should invoke prismaService.iconos.findUnique', async () => {
            const testParams = {
                icono_id: 1
            };
            await iconosService.getIconoById(
                testParams.icono_id
            );
            expect(prismaService.iconos.findUnique).toHaveBeenCalled();
        });
    });

    describe('getFilterIconos method', () => {
        it('should invoke prismaService.iconos.findMany', async () => {
            const testParams = {
                unicode: "a",
                nombre: "a"
            };
            await iconosService.getFilterIconos(
                testParams.unicode, testParams.nombre
            );
            expect(prismaService.iconos.findMany).toHaveBeenCalled();
        });
    });


    describe('createIcono method', () => {
        it('should invoke prismaService.iconos.create', async () => {
            var testParams = {
                data: {
                    nombre: "Nombre",
                    unicode: "a",
                }
            }
            await iconosService.createIcono(testParams.data);
            expect(prismaService.iconos.create).toHaveBeenCalled();
        });
    });

    describe('updateIcono method', () => {
        it('should invoke prismaService.iconos.update', async () => {
            var testParams = {
                data: {
                    nombre: "Nombre",
                    unicode: "a",
                    icono_id: 1
                }
            }
            await iconosService.updateIcono(testParams.data);
            expect(prismaService.iconos.update).toHaveBeenCalled();
        });
    });

    describe('deleteIcono method', () => {
        it('should invoke prismaService.iconos.delete', async () => {
            const testParams = {
                icono_id: 1
            };
            await iconosService.deleteIcono(testParams.icono_id);
            expect(prismaService.iconos.delete).toHaveBeenCalled();
        });
    });

})