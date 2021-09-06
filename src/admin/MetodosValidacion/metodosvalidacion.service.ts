import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateMetodoValidacionInput, UpdateMetodoValidacionInput } from './dto/metodosvalidacion.dto';
import { MetodosValidacion } from './entities/metodosvalidacion.entity';


@Injectable()
export class MetodosValidacionService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async getMetodosValidacion(): Promise<MetodosValidacion[]> {
        return this.prismaService.metodosValidacion.findMany();
    }

    async getMetodoValidacionById(metodo_validacion_id: number): Promise<MetodosValidacion> {
        var metodosValidacion = await this.prismaService.metodosValidacion.findUnique({
            where: { metodo_validacion_id: metodo_validacion_id }
        });

        if (metodosValidacion === null) {
            throw new UnauthorizedException(`El método validación con id ${metodo_validacion_id} no existe`);
        }

        return metodosValidacion;
    }

    async getFilterMetodosValidacion(metodo: string): Promise<MetodosValidacion[]> {
        return this.prismaService.metodosValidacion.findMany({
            where: { OR: [{ metodo: { contains: metodo, mode: "insensitive" } }] }
        })
    }

    async createMetodoValidacion(data: CreateMetodoValidacionInput): Promise<MetodosValidacion> {
        return this.prismaService.metodosValidacion.create({
            data: { metodo: data.metodo }
        });
    }

    async updateMetodoValidacion(data: UpdateMetodoValidacionInput): Promise<MetodosValidacion> {

        await this.getMetodoValidacionById(data.metodo_validacion_id);

        return this.prismaService.metodosValidacion.update({
            where: { metodo_validacion_id: data.metodo_validacion_id },
            data: { metodo: data.metodo, activo: data.activo }
        });
    }

    async deleteMetodoValidacion(metodo_validacion_id: number): Promise<MetodosValidacion> {

        await this.getMetodoValidacionById(metodo_validacion_id);

        return this.prismaService.metodosValidacion.delete({
            where: { metodo_validacion_id: metodo_validacion_id }
        });
    }
}
