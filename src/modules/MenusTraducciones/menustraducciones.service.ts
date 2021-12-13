import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MenusService } from '../Menus/menus.service';
import { TraduccionesService } from '../Traducciones/traducciones.service';
import { PrismaService } from '../../prisma.service';
import { CreateMenuTraduccionInput, UpdateMenuTraduccionInput } from './dto/menustraducciones.dto';

@Injectable()
export class MenusTraduccionesService {
    constructor(
        private prismaService: PrismaService,
        private menusService: MenusService,
        private traduccionesService: TraduccionesService
    ) { }

    async getMenusTraducciones() {
        return this.prismaService.menusTraducciones.findMany();
    }

    async getMenuTraduccionById(menus_traduccion_id: number) {
        var menusTraducciones = await this.prismaService.menusTraducciones.findUnique({
            where: { menu_traduccion_id: menus_traduccion_id }
        });

        if (menusTraducciones === null) {
            throw new UnauthorizedException(`El menú traducción con id ${menus_traduccion_id} no existe`);
        }

        return menusTraducciones;
    }

    async createMenuTraduccion(data: CreateMenuTraduccionInput) {

        await this.menusService.getMenuById(data.menu_id);
        await this.traduccionesService.getTraduccionById(data.traduccion_id);

        return this.prismaService.menusTraducciones.create({
            data: {
                ...data
            }
        })
    }

    async updateMenuTraduccion(data: UpdateMenuTraduccionInput) {

        await this.getMenuTraduccionById(data.menu_traduccion_id);
        await this.menusService.getMenuById(data.menu_id);
        await this.traduccionesService.getTraduccionById(data.traduccion_id);

        return this.prismaService.menusTraducciones.update({
            where: { menu_traduccion_id: data.menu_traduccion_id },
            data: {
                ...data
            }
        });
    }

    async deleteMenuTraduccion(menu_traduccion_id: number) {

        await this.getMenuTraduccionById(menu_traduccion_id);

        return this.prismaService.menusTraducciones.delete({
            where: { menu_traduccion_id: menu_traduccion_id }
        });
    }
}
