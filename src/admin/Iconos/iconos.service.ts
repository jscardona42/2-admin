import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
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
        return this.prismaService.iconos.findUnique({
            where: { icono_id: icono_id }
        });
    }

    async createIcono(data: CreateIconoInput): Promise<Iconos> {
        return this.prismaService.iconos.create({
            data: { nombre: data.nombre }
        });
    }

    async updateIcono(data: UpdateIconoInput): Promise<Iconos> {
        return this.prismaService.iconos.update({
            where: { icono_id: data.icono_id },
            data: { nombre: data.nombre }
        });
    }

    async modifyIconoEstado(icono_id: number, activo: boolean): Promise<Iconos> {
        return this.prismaService.iconos.update({
            where: { icono_id: icono_id },
            data: { activo: activo }
        });
    }
}
