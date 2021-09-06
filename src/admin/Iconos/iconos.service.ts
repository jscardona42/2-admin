import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateIconoInput, UpdateIconoInput } from './dto/iconos.dto';
import { Iconos } from './entities/iconos.entity';


@Injectable()
export class IconosService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async getIconos(): Promise<Iconos[]> {
        return this.prismaService.iconos.findMany();
    }

    async getIconoById(icono_id: number): Promise<Iconos> {
        var iconos = await this.prismaService.iconos.findUnique({
            where: { icono_id: icono_id }
        });

        if (iconos === null) {
            throw new UnauthorizedException(`El ícono con id ${icono_id} no existe`);
        }

        return iconos;
    }

    async getFilterIconos(nombre: string, unicode: string): Promise<Iconos[]> {
        return this.prismaService.iconos.findMany({
            where: { OR: [{ nombre: { contains: nombre, mode: "insensitive" } }, { unicode: { contains: unicode, mode: "insensitive" } }] }
        })
    }

    async createIcono(data: CreateIconoInput): Promise<Iconos> {
        return this.prismaService.iconos.create({
            data: { nombre: data.nombre, unicode: data.unicode }
        });
    }

    async updateIcono(data: UpdateIconoInput): Promise<Iconos> {

        await this.getIconoById(data.icono_id);

        return this.prismaService.iconos.update({
            where: { icono_id: data.icono_id },
            data: { nombre: data.nombre, unicode: data.unicode, activo: data.activo }
        });
    }

    async deleteIcono(icono_id: number): Promise<Iconos> {

        await this.getIconoById(icono_id);

        return this.prismaService.iconos.delete({
            where: { icono_id: icono_id }
        });
    }
}
