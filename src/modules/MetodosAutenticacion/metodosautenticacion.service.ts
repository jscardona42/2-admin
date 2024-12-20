import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateMetodoAutenticacionInput, FilterMetodosAutenticacionInput, UpdateMetodoAutenticacionInput } from './dto/metodosautenticacion.dto';

@Injectable()
export class TbMetodosAutenticacionService {
    constructor(
        private prismaService: PrismaService,
    ) { }

    async getMetodosAutenticacion(): Promise<any> {
        return this.prismaService.tbMetodosAutenticacion.findMany({
            include: { Usuarios: true }
        });
    }

    async getMetodoAutenticacionById(metodo_autenticacion_id: number): Promise<any> {
        let metodo = await this.prismaService.tbMetodosAutenticacion.findUnique({
            where: { metodo_autenticacion_id: metodo_autenticacion_id },
            include: { Usuarios: true }
        })

        if (metodo === null) {
            throw new UnauthorizedException(`El metodo de autenticacion con id ${metodo_autenticacion_id} no existe`);
        }
        return metodo;
    }

    async getFilterMetodosAutenticacion(data: FilterMetodosAutenticacionInput): Promise<any> {
        return this.prismaService.tbMetodosAutenticacion.findMany({
            where: data,
            orderBy: { metodo_autenticacion_id: "asc" }
        })
    }

    async createMetodoAutenticacion(data: CreateMetodoAutenticacionInput): Promise<any> {
        try {
            return await this.prismaService.tbMetodosAutenticacion.create({
                data: {
                    nombre: data.nombre
                },
                include: { Usuarios: true }
            });
        }
        catch (e) {
            if (e.code === 'P2002') {
                throw new UnauthorizedException(`El nombre ya se encuentra registrado`);
            }
        }
    }

    async updateMetodoAutenticacion(data: UpdateMetodoAutenticacionInput): Promise<any> {

        await this.getMetodoAutenticacionById(data.metodo_autenticacion_id);

        return this.prismaService.tbTipoUsuarios.update({
            where: { tipo_usuario_id: data.metodo_autenticacion_id },
            data: {
                ...data
            },
            include: { Usuarios: true }
        });
    }

    async deleteMetodoAutenticacion(metodo_autenticacion_id: number): Promise<any> {

        await this.getMetodoAutenticacionById(metodo_autenticacion_id);

        return this.prismaService.tbMetodosAutenticacion.delete({
            where: { metodo_autenticacion_id: metodo_autenticacion_id },
            include: { Usuarios: true }
        });
    }
}
