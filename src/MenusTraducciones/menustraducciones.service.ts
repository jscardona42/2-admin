import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMenuTraduccionInput, UpdateMenuTraduccionInput } from './dto/menustraducciones.dto';

@Injectable()
export class MenusTraduccionesService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async getMenusTraducciones() {
        return this.prismaService.menusTraducciones.findMany();
    }

    async getMenuTraduccionById(menus_traduccion_id: number) {
        return this.prismaService.menusTraducciones.findUnique({
            where: { menu_traduccion_id: menus_traduccion_id }
        });
    }

    async createMenuTraduccion(data: CreateMenuTraduccionInput) {
        return this.prismaService.menusTraducciones.create({
            data: {
                ...data
            }
        })
    }

    async updateMenuTraduccion(data: UpdateMenuTraduccionInput) {
        return this.prismaService.menusTraducciones.update({
            where: { menu_traduccion_id: data.menu_traduccion_id },
            data: {
                ...data
            }
        });
    }

    async deleteMenuTraduccion(menu_traduccion_id: number) {
        return this.prismaService.menusTraducciones.delete({
            where: { menu_traduccion_id: menu_traduccion_id }
        });
    }
}
