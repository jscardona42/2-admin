import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMenuInput, UpdateMenuInput } from './dto/menus.dto';

@Injectable()
export class MenusService {
  constructor(
    private prismaService: PrismaService
  ) { }

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

  async createRootMenu(): Promise<Object> {
    return await this.prismaService.menus.create({
      data: {
        title: 'menu',
        path: '/',
        isEntity: false,
        parentMenuId: null,
      },
    });
  }

  async createFolder(data: CreateMenuInput): Promise<Object> {
    await this.doesParentFolderExist(data.parentId);
    const createdFolder = await this.prismaService.menus.create({
      data: {
        title: data.name,
        isEntity: false,
        order: data.order,
        icon: data.icon,
        path: '',
        Menus: {
          connect: {
            menu_id: data.parentId,
          },
        },
      },
    });
    return await this.updateFolderPath(createdFolder.menu_id, data.name);
  }

  async insertEntityToFolder(data: CreateMenuInput) {
    const createdEntity = await this.prismaService.menus.create({
      data: {
        title: data.name,
        isEntity: true,
        path: '',
        order: data.order,
        icon: data.icon,
        Menus: { connect: { menu_id: data.parentId, }, },
        entidad_id: data.entidad_id
      },
    });
    return await this.updateFolderPath(createdEntity.menu_id, data.name);
  }

  async doesParentFolderExist(parentId: number): Promise<void> {
    await this.prismaService.menus.findUnique({
      where: {
        menu_id: parentId,
      },
      rejectOnNotFound: () =>
        new NotFoundException(`Folder with id: ${parentId} does not exist`),
    });
  }

  async updateFolderPath(folderId: number, folderName: string): Promise<Object> {
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

    var level = path.split("/").length - 1;

    return await this.prismaService.menus.update({
      where: {
        menu_id: folderId,
      },
      data: {
        path: path.replace(" ", "").toLowerCase(),
        level: level
      },
    });
  }

  async getFilterMenu(OR: any, AND: any, traduccion_id: number): Promise<Object> {
    var traducciones = [];
    var traduccionesIds = [];
    traduccionesIds[0] = traduccion_id;

    if (traduccion_id === 0) {
      traducciones = await this.prismaService.traducciones.findMany({
        select: { traduccion_id: true }
      })

      traducciones.forEach(function (traduccion, index) {
        traduccionesIds[index] = traduccion.traduccion_id;
      });
    }

    return await this.prismaService.menus.findMany({
      where: {
        menu_id: 1,
      },
      select: {
        menu_id: true,
        title: true,
        path: true,
        isEntity: true,
        order: true,
        level: true,
        parentMenuId: true,
        MenusPalabras: { select: { palabra: true } },
        MenusTraducciones: { select: { traduccion: true }, where: { traduccion_id: { in: traduccionesIds } } },
        other_Menus: {
          where: {
            OR: OR,
            AND: AND
          },
          select: {
            menu_id: true,
            title: true,
            path: true,
            isEntity: true,
            order: true,
            level: true,
            MenusPalabras: { select: { palabra: true } },
            MenusTraducciones: { select: { traduccion: true }, where: { traduccion_id: { in: traduccionesIds } } },
            other_Menus: {
              where: {
                OR: OR,
                AND: AND
              },
              select: {
                menu_id: true,
                title: true,
                path: true,
                isEntity: true,
                order: true,
                level: true,
                MenusPalabras: { select: { palabra: true } },
                MenusTraducciones: { select: { traduccion: true }, where: { traduccion_id: { in: traduccionesIds } } },
                other_Menus: {
                  where: {
                    OR: OR,
                    AND: AND
                  },
                },
              }
            },
          },
        },
      },
    });

  }

  async getFilterMenuPalabra(palabra: string): Promise<Object[]> {
    return this.prismaService.menus.findMany({
      where: { MenusPalabras: { some: { palabra: { contains: palabra, mode: "insensitive" } } } }
    })
  }

  async updateMenu(data: UpdateMenuInput) {

    await this.validateLevel(data);

    var is_entity = false;
    var entidad_id = null;

    if (data.entidad_id !== undefined) {
      is_entity = true;
      entidad_id = data.entidad_id;
    }
    var menu = await this.prismaService.menus.update({
      where: { menu_id: data.menu_id },
      data: {
        parentMenuId: data.parentId,
        title: data.name,
        icon: data.icon,
        entidad_id: entidad_id,
        isEntity: is_entity
      }
    })

    await this.updateParent(data.parentId);

    return await this.updateFolderPath(data.menu_id, menu.title)
  }

  async validateLevel(data) {
    var parentMenu = await this.prismaService.menus.findFirst({
      where: { menu_id: data.parentId },
    })

    if (data.entidad_id === undefined && parentMenu.level >= 2) {
      throw new UnauthorizedException("At this level you can only create entities");
    }
  }

  async updateParent(parentId) {
    return await this.prismaService.menus.update({
      where: { menu_id: parentId },
      data: {
        entidad_id: null,
        isEntity: false,
      }
    })
  }

}
