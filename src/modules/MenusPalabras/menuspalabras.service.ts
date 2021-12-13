import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MenusService } from '../Menus/menus.service';
import { PrismaService } from '../../prisma.service';
import { CreateMenuPalabrasInput, UpdateMenuPalabrasInput } from './dto/menuspalabras.dto';

@Injectable()
export class MenusPalabrasService {
    constructor(
        private prismaService: PrismaService,
        private menusService: MenusService
    ) { }

    async getMenusPalabras() {
        return this.prismaService.menusPalabras.findMany();
    }

    async getMenuPalabraById(menu_palabra_id: number) {
        var menusPlabras = await this.prismaService.menusPalabras.findUnique({
            where: { menu_palabra_id: menu_palabra_id }
        });

        if (menusPlabras === null) {
            throw new UnauthorizedException(`El menú palabra con id ${menu_palabra_id} no existe`);
        }

        return menusPlabras;
    }

    async createMenuPalabra(data: CreateMenuPalabrasInput) {

        await this.menusService.getMenuById(data.menu_id);

        return this.prismaService.menusPalabras.create({
            data: { menu_id: data.menu_id, palabra: data.palabra }
        });
    }

    async updateMenuPalabra(data: UpdateMenuPalabrasInput) {

        await this.getMenuPalabraById(data.menu_palabra_id);
        await this.menusService.getMenuById(data.menu_id);

        return this.prismaService.menusPalabras.update({
            where: { menu_palabra_id: data.menu_palabra_id },
            data: { menu_id: data.menu_id, palabra: data.palabra }
        });
    }

    async deleteMenuPalabra(menu_palabra_id: number) {

        await this.getMenuPalabraById(menu_palabra_id);

        return this.prismaService.menusPalabras.delete({
            where: { menu_palabra_id: menu_palabra_id }
        });
    }
}
