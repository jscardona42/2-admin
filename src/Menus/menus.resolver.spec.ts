import { MenusResolver } from './menus.resolver';
import { Test } from '@nestjs/testing';
import { MenusService } from './menus.service';

describe('Menu Resolver', () => {
  let menuResolver: MenusResolver;
  let menuService: MenusService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MenusResolver,
        {
          provide: MenusService,
          useFactory: () => ({
            rootMenu: jest.fn(),
            createRootMenu: jest.fn(),
            createFolder: jest.fn(),
            insertEntityToFolder: jest.fn(),
            filterMenu: jest.fn()
          }),
        },
      ],
    }).compile();

    menuResolver = module.get<MenusResolver>(MenusResolver);
    menuService = module.get<MenusService>(MenusService);
  });

  describe('Query rootMenu()', () => {
    it('should invoke menuService.rootMenu()', async () => {
      await menuResolver.rootMenu();
      expect(menuService.rootMenu).toHaveBeenCalled();
    });
  });

  describe('Mutation createRootMenu()', () => {
    it('should invoke menuService.createRootMenu', async () => {
      await menuResolver.createRootMenu();
      expect(menuService.createRootMenu).toHaveBeenCalled();
    });
  });

  describe('Mutation createFolder()', () => {
    it('should invoke menuService.createFolder with arguments', async () => {
      const testParams = {
        data: {
          parentId: 5,
          entityName: 'Shipping',
        }
      };
      await menuResolver.createFolder(testParams.data);
      expect(menuService.createFolder).toHaveBeenCalledWith(testParams.data);
    });
  });

  describe('Mutation insertEntityToFolder()', () => {
    it('should invoke menuService.insertEntityToFolder with arguments', async () => {
      const testParams = {
        data: {
          parentId: 5,
          entityName: 'Shipping',
        }
      };
      await menuResolver.insertEntityToFolder(testParams.data)
      expect(menuService.insertEntityToFolder).toHaveBeenCalledWith(testParams.data)
    })
  })
  
});