import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { MenuService } from './menu.service';

describe('Menu Service', () => {
  let menuService: MenuService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: PrismaService,
          useFactory: () => ({
            menus: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn().mockImplementation(() => ({
                parentMenu: jest.fn(() => {
                  return { path: String };
                }),
              })),
              create: jest.fn(() => {
                return {
                  id: Number,
                };
              }),
              update: jest.fn(),
              delete: jest.fn(),
            },
          }),
        },
      ],
    }).compile();

    menuService = module.get<MenuService>(MenuService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('rootMenu method', () => {
    it('should invoke prismaService.menus.findFirst', async () => {
      await menuService.rootMenu();
      expect(prismaService.menus.findFirst).toHaveBeenCalled();
    });
  });

  describe('createRootMenu method', () => {
    it('should invoke prismaService.menus.create', async () => {
      await menuService.createRootMenu();
      expect(prismaService.menus.create).toHaveBeenCalled();
    });
  });

  describe('createFolder method', () => {
    it('should invoke prismaService.menus.create', async () => {
      const testParams = {
        parentId: 2,
        folderName: 'test folder parent',
      };
      await menuService.createFolder(
        testParams.parentId,
        testParams.folderName,
      );
      expect(prismaService.menus.create).toHaveBeenCalled();
    });
  });

  describe('insertEntityToFolder method', () => {
    it('should invoke prismaService.menus.create', async () => {
      const testParams = {
        parentId: 4,
        entityName: 'shipping',
      };
      await menuService.insertEntityToFolder(
        testParams.parentId,
        testParams.entityName,
      );
      expect(prismaService.menus.create).toHaveBeenCalled();
    });
  });
});
