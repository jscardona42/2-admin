import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { MenusTraduccionesService } from './menustraducciones.service';

describe('MenusTraducciones Service', () => {
    let menusTraduccionesService: MenusTraduccionesService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                MenusTraduccionesService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        menusTraducciones: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    }),
                },
            ],
        }).compile();

        menusTraduccionesService = module.get<MenusTraduccionesService>(MenusTraduccionesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getMenusTraducciones method', () => {
        it('should invoke prismaService.menusTraducciones.findMany', async () => {
            await menusTraduccionesService.getMenusTraducciones();
            expect(prismaService.menusTraducciones.findMany).toHaveBeenCalled();
        });
    });

    describe('getMenuTraduccionById method', () => {
        it('should invoke prismaService.menusTraducciones.findUnique', async () => {
            const testParams = {
                menu_traduccion_id: 1
            };
            await menusTraduccionesService.getMenuTraduccionById(
                testParams.menu_traduccion_id
            );
            expect(prismaService.menusTraducciones.findUnique).toHaveBeenCalled();
        });
    });

    describe('createMenuTraduccion method', () => {
        it('should invoke prismaService.menusTraducciones.create', async () => {
            const testParams = {
                data: {
                    traduccion_id: 1,
                    traduccion: "Traducción",
                    menu_id: 1
                }
            };
            await menusTraduccionesService.createMenuTraduccion(
                testParams.data,
            );
            expect(prismaService.menusTraducciones.create).toHaveBeenCalled();
        });
    });

    describe('updateMenuTraduccion method', () => {
        it('should invoke prismaService.menusTraducciones.update', async () => {
            const testParams = {
                data: {
                    menu_traduccion_id:1,
                    traduccion_id: 1,
                    traduccion: "Traducción",
                    menu_id: 1
                }
            };
            await menusTraduccionesService.updateMenuTraduccion(
                testParams.data
            );
            expect(prismaService.menusTraducciones.update).toHaveBeenCalled();
        });
    });

    describe('deleteMenuTraduccion method', () => {
        it('should invoke prismaService.menusTraducciones.delete', async () => {
            const testParams = {
                menu_traduccion_id: 2
            };
            await menusTraduccionesService.deleteMenuTraduccion(
                testParams.menu_traduccion_id
            );
            expect(prismaService.menusTraducciones.delete).toHaveBeenCalled();
        });
    });
});
