import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTraduccionesInput, UpdateTraduccionesInput } from './dto/traducciones.dto';

@Injectable()
export class TraduccionesService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async getTraducciones() {
        return this.prismaService.traducciones.findMany();
    }

    async getTraduccionById(traduccion_id: number) {
        var traducciones = await this.prismaService.traducciones.findUnique({
            where: { traduccion_id: traduccion_id }
        });

        if (traducciones === null) {
            throw new UnauthorizedException(`La traducción con id ${traduccion_id} no existe`);
        }

        return traducciones;
    }

    async createTraduccion(data: CreateTraduccionesInput) {
        return this.prismaService.traducciones.create({
            data: { idioma: data.idioma, sigla: data.sigla }
        });
    }

    async updateTraduccion(data: UpdateTraduccionesInput) {

        await this.getTraduccionById(data.traduccion_id);

        return this.prismaService.traducciones.update({
            where: { traduccion_id: data.traduccion_id },
            data: { idioma: data.idioma, sigla: data.sigla }
        });
    }

    async deleteTraduccion(traduccion_id: number) {

        await this.getTraduccionById(traduccion_id);

        return this.prismaService.traducciones.delete({
            where: { traduccion_id: traduccion_id }
        });
    }
}
