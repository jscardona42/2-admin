import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { MenusService } from './menus.service';

describe('Menu Service', () => {
  let menuService: MenusService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MenusService,
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

    menuService = module.get<MenusService>(MenusService);
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
        data: {
          parentId: 2,
          entityName: "Nombre"
        }
      };
      await menuService.createFolder(testParams.data);
      expect(prismaService.menus.create).toHaveBeenCalled();
    });
  });

  describe('insertEntityToFolder method', () => {
    it('should invoke prismaService.menus.create', async () => {
      const testParams = {
        data: {
          parentId: 2,
          entityName: "Nombre"
        }
      };
      await menuService.insertEntityToFolder(testParams.data);
      expect(prismaService.menus.create).toHaveBeenCalled();
    });
  });
});
