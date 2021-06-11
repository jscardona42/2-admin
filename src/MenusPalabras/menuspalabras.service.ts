import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMenuPalabrasInput, UpdateMenuPalabrasInput } from './dto/menuspalabras.dto';

@Injectable()
export class MenusPalabrasService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async getMenusPalabras() {
        return this.prismaService.menusPalabras.findMany();
    }

    async getMenuPalabraById(menu_palabra_id: number) {
        return this.prismaService.menusPalabras.findUnique({
            where: { menu_palabra_id: menu_palabra_id }
        });
    }

    async createMenuPalabra(data: CreateMenuPalabrasInput) {
        return this.prismaService.menusPalabras.create({
            data: { menu_id: data.menu_id, palabra: data.palabra }
        });
    }

    async updateMenuPalabra(data: UpdateMenuPalabrasInput) {
        return this.prismaService.menusPalabras.update({
            where: { menu_palabra_id: data.menu_palabra_id },
            data: { menu_id: data.menu_id, palabra: data.palabra }
        });
    }

    async deleteMenuPalabra(menu_palabra_id: number) {
        return this.prismaService.menusPalabras.delete({
            where: { menu_palabra_id: menu_palabra_id }
        });
    }
}
