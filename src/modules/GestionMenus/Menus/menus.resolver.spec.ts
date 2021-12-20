import { MenusResolver } from './menus.resolver';
import { Test } from '@nestjs/testing';
import { MenusService } from './menus.service';

describe('Menu Resolver', () => {
  let menusResolver: MenusResolver;
  let menusService: MenusService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MenusResolver,
        {
          provide: MenusService,
          useFactory: () => ({
            getMenus: jest.fn(),
            getMenuByRoleId: jest.fn(),
            getMenusInactivos: jest.fn(),
            createRootMenu: jest.fn(),
            createMenu: jest.fn(),
            filterMenu: jest.fn()
          }),
        },
      ],
    }).compile();

    menusResolver = module.get<MenusResolver>(MenusResolver);
    menusService = module.get<MenusService>(MenusService);
  });

  describe('Query getMenus()', () => {
    it('should invoke menusService.getMenus()', async () => {
      await menusResolver.getMenus();
      expect(menusService.getMenus).toHaveBeenCalled();
    });
  });

  describe('Query getMenuByRoleId()', () => {
    it('should invoke menusService.getTraduccionById', async () => {
      const testParams = {
        usuario_id: 1
      };
      await menusResolver.getMenuByRoleId(testParams.usuario_id);
      expect(menusService.getMenuByRoleId).toHaveBeenCalled();
    });
  });

  describe('Query getMenusInactivos()', () => {
    it('should invoke menusService.getMenusInactivos()', async () => {
      await menusResolver.getMenusInactivos();
      expect(menusService.getMenusInactivos).toHaveBeenCalled();
    });
  });

  describe('Mutation createRootMenu', () => {
    it('should invoke menusService.createRootMenu', async () => {
      await menusResolver.createRootMenu();
      expect(menusService.createRootMenu).toHaveBeenCalled();
    });
  });

  describe('Mutation createMenu', () => {
    it('should invoke menusService.createMenu with arguments', async () => {
      const testParams = {
        data: {
          parentId: 5,
          name: 'Shipping',
        }
      };
      await menusResolver.createMenu(testParams.data)
      expect(menusService.createMenu).toHaveBeenCalledWith(testParams.data)
    })
  })

});