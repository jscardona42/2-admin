import { Test } from '@nestjs/testing';
import { MenusTraduccionesResolver } from './menustraducciones.resolver';
import { MenusTraduccionesService } from './menustraducciones.service';

describe('MenusTraducciones Resolver', () => {
    let menusTraduccionesService: MenusTraduccionesService;
    let menusTraduccionesResolver: MenusTraduccionesResolver;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                MenusTraduccionesResolver,
                {
                    provide: MenusTraduccionesService,
                    useFactory: () => ({
                        getMenusTraducciones: jest.fn(),
                        getMenuTraduccionById: jest.fn(),
                        createMenuTraduccion: jest.fn(),
                        updateMenuTraduccion: jest.fn(),
                        deleteMenuTraduccion: jest.fn()
                    }),
                },
            ],
        }).compile();

        menusTraduccionesResolver = module.get<MenusTraduccionesResolver>(MenusTraduccionesResolver);
        menusTraduccionesService = module.get<MenusTraduccionesService>(MenusTraduccionesService);
    });

    describe('Query getMenusTraducciones()', () => {
        it('should invoke menusTraduccionesService.getMenusTraducciones()', async () => {
            await menusTraduccionesResolver.getMenusTraducciones();
            expect(menusTraduccionesService.getMenusTraducciones).toHaveBeenCalled();
        });
    });

    describe('Query getMenuTraduccionById()', () => {
        it('should invoke menusTraduccionesService.getMenuTraduccionById', async () => {
            const testParams = {
                menu_traduccion_id: 1
            };
            await menusTraduccionesResolver.getMenuTraduccionById(testParams.menu_traduccion_id);
            expect(menusTraduccionesService.getMenuTraduccionById).toHaveBeenCalled();
        });
    });

    describe('Query createMenuTraduccion()', () => {
        it('should invoke menusTraduccionesService.createMenuTraduccion', async () => {
            const testParams = {
                data: {
                    traduccion_id: 1,
                    menu_id: 1,
                    traduccion: "Traducción"
                }
            };
            await menusTraduccionesResolver.createMenuTraduccion(testParams.data);
            expect(menusTraduccionesService.createMenuTraduccion).toHaveBeenCalled();
        });
    });

    describe('Mutation updateMenuTraduccion()', () => {
        it('should invoke menusTraduccionesService.updateMenuTraduccion with arguments', async () => {
            const testParams = {
                data: {
                    traduccion_id: 1,
                    menu_id: 1,
                    traduccion: "Trad",
                    menu_traduccion_id: 1
                }
            };
            await menusTraduccionesResolver.updateMenuTraduccion(testParams.data);
            expect(menusTraduccionesService.updateMenuTraduccion).toHaveBeenCalledWith(
                testParams.data
            );
        });
    });

    describe('Mutation deleteMenuTraduccion()', () => {
        it('should invoke menusTraduccionesService.deleteMenuTraduccion with arguments', async () => {
            const testParams = {
                menu_traduccion_id: 1
            };
            await menusTraduccionesResolver.deleteMenuTraduccion(testParams.menu_traduccion_id);
            expect(menusTraduccionesService.deleteMenuTraduccion).toHaveBeenCalledWith(
                testParams.menu_traduccion_id
            );
        });
    });
});