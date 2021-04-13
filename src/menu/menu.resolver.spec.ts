import { MenuResolver } from './menu.resolver';
import { MenuService } from './menu.service';
import { Test } from '@nestjs/testing';

describe('Menu Resolver', () => {
  let menuResolver: MenuResolver;
  let menuService: MenuService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MenuResolver,
        {
          provide: MenuService,
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

    menuResolver = module.get<MenuResolver>(MenuResolver);
    menuService = module.get<MenuService>(MenuService);
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
        parentId: 3,
        folderName: 'test folder',
      };
      await menuResolver.createFolder(
        testParams.parentId,
        testParams.folderName,
      );
      expect(menuService.createFolder).toHaveBeenCalledWith(
        testParams.parentId,
        testParams.folderName,
      );
    });
  });

  describe('Mutation insertEntityToFolder()',()=>{
    it('should invoke menuService.insertEntityToFolder with arguments', async()=>{
      const testParams = {
        parentId: 5,
        entityName: 'Shipping',
      };
      await menuResolver.insertEntityToFolder(testParams.parentId, testParams.entityName)
      expect(menuService.insertEntityToFolder).toHaveBeenCalledWith(testParams.parentId, testParams.entityName)
    })
  })

  describe('Query filteredMenuForRoleId', ()=>{
    it('should invoke menuService.filterMenu with arguments', async()=>{
      const testRoleIdParam: number = 5
      await menuResolver.filteredMenuForRoleId(testRoleIdParam)
      expect(menuService.filterMenu).toHaveBeenCalledWith(testRoleIdParam)
    })
  })
});