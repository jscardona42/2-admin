import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service'
import { CreateEstadosUsuariosInput, FilterEstadoUsuariosInput, UpdateEstadosUsuariosInput } from './dto/estadosusuarios.dto';

@Injectable()
export class TbEstadosUsuariosService {
    constructor(
        private prismaService: PrismaService,
    ) { }

    async getEstadosUsuarios(): Promise<any>{
        return this.prismaService.tbEstadosUsuarios.findMany({
            include:{ Usuarios: true }
        });
    }

    async getEstadosUsuariosById(estado_usuario_id: number): Promise<any> {
        let usuarios = await this.prismaService.tbEstadosUsuarios.findUnique({
            where: { estado_usuario_id: estado_usuario_id },
            include: { Usuarios: true }
        })

        if (usuarios === null) {
            throw new UnauthorizedException(`El tipo de usuario con id ${estado_usuario_id} no existe`);
        }
        return usuarios;
    }

    async getFilterEstadosUsuarios(data: FilterEstadoUsuariosInput): Promise<any> {
        return this.prismaService.tbEstadosUsuarios.findMany({
            where: data, 
            orderBy: {estado_usuario_id: "asc"} 
        })
    }

    async createEstadosUsuarios(data: CreateEstadosUsuariosInput): Promise<any> {
        return this.prismaService.tbEstadosUsuarios.create({
            data: {
                ...data
            },
            include: { Usuarios: true }
        });
    }

    async updateEstadosUsuarios(data: UpdateEstadosUsuariosInput): Promise<any> {

        await this.getEstadosUsuariosById(data.estado_usuario_id);

        return this.prismaService.tbEstadosUsuarios.update({
            where: { estado_usuario_id: data.estado_usuario_id },
            data: {
                ...data
            },
            include: { Usuarios: true }
        });
    }

    async deleteEstadosUsuarios(estado_usuario_id: number): Promise<any> {

        await this.getEstadosUsuariosById(estado_usuario_id);

        return this.prismaService.tbEstadosUsuarios.delete({
            where: { estado_usuario_id: estado_usuario_id },
            include: { Usuarios: true }
        });
    }
}
