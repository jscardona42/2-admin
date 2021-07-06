import { Test } from '@nestjs/testing';
import { MenusPalabrasResolver } from './menuspalabras.resolver';
import { MenusPalabrasService } from './menuspalabras.service';

describe('MenusPalabras Resolver', () => {
    let menusPalabrasResolver: MenusPalabrasResolver;
    let menusPalabrasService: MenusPalabrasService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                MenusPalabrasResolver,
                {
                    provide: MenusPalabrasService,
                    useFactory: () => ({
                        getMenusPalabras: jest.fn(),
                        getMenuPalabraById: jest.fn(),
                        createMenuPalabra: jest.fn(),
                        updateMenuPalabra: jest.fn(),
                        deleteMenuPalabra: jest.fn()
                    }),
                },
            ],
        }).compile();

        menusPalabrasResolver = module.get<MenusPalabrasResolver>(MenusPalabrasResolver);
        menusPalabrasService = module.get<MenusPalabrasService>(MenusPalabrasService);
    });

    describe('Query getMenusPalabras()', () => {
        it('should invoke menusPalabrasService.getMenusPalabras()', async () => {
            await menusPalabrasResolver.getMenusPalabras();
            expect(menusPalabrasService.getMenusPalabras).toHaveBeenCalled();
        });
    });

    describe('Query getMenuPalabraById()', () => {
        it('should invoke menusPalabrasService.getMenuPalabraById', async () => {
            const testParams = {
                menu_palabra_id: 1
            };
            await menusPalabrasResolver.getMenuPalabraById(testParams.menu_palabra_id);
            expect(menusPalabrasService.getMenuPalabraById).toHaveBeenCalled();
        });
    });

    describe('Query createMenuPalabra()', () => {
        it('should invoke menusPalabrasService.createMenuPalabra', async () => {
            const testParams = {
                data: {
                    menu_id: 1,
                    palabra: "Palabra"
                }
            };
            await menusPalabrasResolver.createMenuPalabra(testParams.data);
            expect(menusPalabrasService.createMenuPalabra).toHaveBeenCalled();
        });
    });

    describe('Mutation updateMenuPalabra()', () => {
        it('should invoke menusPalabrasService.updateMenuPalabra with arguments', async () => {
            const testParams = {
                data: {
                    menu_id: 1,
                    palabra: "Palabra",
                    menu_palabra_id: 1
                }
            };
            await menusPalabrasResolver.updateMenuPalabra(testParams.data);
            expect(menusPalabrasService.updateMenuPalabra).toHaveBeenCalledWith(
                testParams.data
            );
        });
    });

    describe('Mutation deleteMenuPalabra()', () => {
        it('should invoke menusPalabrasService.deleteMenuPalabra with arguments', async () => {
            const testParams = {
                menu_palabra_id: 1
            };
            await menusPalabrasResolver.deleteMenuPalabra(testParams.menu_palabra_id);
            expect(menusPalabrasService.deleteMenuPalabra).toHaveBeenCalledWith(
                testParams.menu_palabra_id
            );
        });
    });
});