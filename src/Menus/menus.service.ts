import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MenusService {
  constructor(private prismaService: PrismaService) { }

  async rootMenu(): Promise<Object> {
    return await this.prismaService.menus.findFirst({
      where: {
        parentMenuId: null,
      },
      include: {
        other_Menus: {
          include: {
            other_Menus: {
              include: {
                other_Menus: {
                  include: {
                    other_Menus: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async createRootMenu(): Promise<Object>  {
    return await this.prismaService.menus.create({
      data: {
        title: 'menu',
        path: '/',
        isEntity: false,
        parentMenuId: null,
      },
    });
  }

  async createFolder(parentId: number, folderName: string): Promise<Object>  {
    await this.doesParentFolderExist(parentId);
    const createdFolder = await this.prismaService.menus.create({
      data: {
        title: folderName,
        isEntity: false,
        path: '',
        Menus: {
          connect: {
            menu_id: parentId,
          },
        },
      },
    });
    return await this.updateFolderPath(createdFolder.menu_id, folderName);
  }

  async insertEntityToFolder(parentId: number, entityName: string): Promise<Object>  {
    const createdEntity = await this.prismaService.menus.create({
      data: {
        title: entityName,
        isEntity: true,
        order: 1,
        path: '',
        Menus: {
          connect: {
            menu_id: parentId,
          },
        },
      },
    });
    return await this.updateFolderPath(createdEntity.menu_id, entityName);
  }

  async doesParentFolderExist(parentId: number): Promise<void>  {
    await this.prismaService.menus.findUnique({
      where: {
        menu_id: parentId,
      },
      rejectOnNotFound: () =>
        new NotFoundException(`Folder with id: ${parentId} does not exist`),
    });
  }

  async updateFolderPath(folderId: number, folderName: string): Promise<Object>  {
    let path: string;
    const parent = await this.prismaService.menus
      .findUnique({
        where: {
          menu_id: folderId,
        },
      })
      .Menus({
        select: {
          path: true,
        },
      });
    if (parent.path === '/') {
      path = parent.path + folderName;
    } else {
      path = parent.path + '/' + folderName;
    }
    return await this.prismaService.menus.update({
      where: {
        menu_id: folderId,
      },
      data: {
        path: path,
      },
    });
  }

  async filterMenu(roleId: number): Promise<Object>  {
    const permissions = await this.prismaService.rolesMenus.findMany({
      where: {
        rol_id: roleId,
      },
      select: {
        permisos_menu: true,
      },
    });
    const filteredMenu = await this.prismaService.menus.findUnique({
      where: {
        menu_id: 1,
      },
      select: {
        menu_id: true,
        title: true,
        path: true,
        isEntity: true,
        parentMenuId: true,
        other_Menus: {
          select: {
            menu_id: true,
            title: true,
            path: true,
            isEntity: true,
            other_Menus: {
              where: {
                OR: [
                  {
                    title: {
                      in: permissions[0].permisos_menu,
                    },
                  },
                  { isEntity: false },
                ],
              },
              select: {
                menu_id: true,
                title: true,
                path: true,
                isEntity: true,
                other_Menus: {
                  where: {
                    title: { in: permissions[0].permisos_menu },
                  },
                },
              },
            },
          },
        },
      },
    });
    return filteredMenu;
  }
}
