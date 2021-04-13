import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MenuService {
  constructor(private prismaService: PrismaService) {}

  async rootMenu() {
    return await this.prismaService.menus.findFirst({
      where: {
        parentMenuId: null,
      },
      include: {
        subMenu: {
          include: {
            subMenu: {
              include: {
                subMenu: {
                  include: {
                    subMenu: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async createRootMenu() {
    return await this.prismaService.menus.create({
      data: {
        title: 'menu',
        path: '/',
        isEntity: false,
        parentMenuId: null,
      },
    });
  }

  async createFolder(parentId: number, folderName: string) {
    await this.doesParentFolderExist(parentId);
    const createdFolder = await this.prismaService.menus.create({
      data: {
        title: folderName,
        isEntity: false,
        path: '',
        parentMenu: {
          connect: {
            id: parentId,
          },
        },
      },
    });
    return await this.updateFolderPath(createdFolder.id, folderName);
  }

  async insertEntityToFolder(parentId: number, entityName: string) {
    const createdEntity = await this.prismaService.menus.create({
      data: {
        title: entityName,
        isEntity: true,
        path: '',
        parentMenu: {
          connect: {
            id: parentId,
          },
        },
      },
    });
    return await this.updateFolderPath(createdEntity.id, entityName);
  }

  async doesParentFolderExist(parentId: number) {
    await this.prismaService.menus.findUnique({
      where: {
        id: parentId,
      },
      rejectOnNotFound: () =>
        new NotFoundException(`Folder with id: ${parentId} does not exist`),
    });
  }

  async updateFolderPath(folderId: number, folderName: string) {
    let path: string;
    const parent = await this.prismaService.menus
      .findUnique({
        where: {
          id: folderId,
        },
      })
      .parentMenu({
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
        id: folderId,
      },
      data: {
        path: path,
      },
    });
  }

  async filterMenu(roleId: number) {
    const permissions = await this.prismaService.roles_permissions.findMany({
      where: {
        role_id: roleId,
      },
      select: {
        permissions: true,
      },
    });
    const filteredMenu = await this.prismaService.menus.findUnique({
      where: {
        id: 1,
      },
      select: {
        id: true,
        title: true,
        path: true,
        isEntity: true,
        parentMenuId: true,
        subMenu: {
          select: {
            id: true,
            title: true,
            path: true,
            isEntity: true,
            subMenu: {
              where: {
                OR: [
                  {
                    title: {
                      in: permissions[0].permissions,
                    },
                  },
                  { isEntity: false },
                ],
              },
              select: {
                id: true,
                title: true,
                path: true,
                isEntity: true,
                subMenu: {
                  where: {
                    title: { in: permissions[0].permissions },
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
