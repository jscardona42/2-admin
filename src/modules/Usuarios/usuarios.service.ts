import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { JwtService } from "@nestjs/jwt";
import { AuditoriasService } from '../Auditorias/auditorias.service';
import { Usuarios } from './entities/usuarios.entity';


@Injectable()
export class UsuariosService {
    constructor(
        private prismaService: PrismaService,
    ) { }

    async getUsuarios(): Promise<Usuarios[]> {
        return this.prismaService.usuarios.findMany();
    }

    async getUsuarioById(usuario_id: number) {
        var usuarios = await this.prismaService.usuarios.findUnique({
            where: { usuario_id: usuario_id },
        })

        if (usuarios === null) {
            throw new UnauthorizedException(`El usuario con id ${usuario_id} no existe`);
        }

        return usuarios;
    }

    async getFilterUsuarios(nombre: string, email: string): Promise<Usuarios[]> {
        return this.prismaService.usuarios.findMany({
            where: { OR: [{ nombre: { contains: nombre, mode: "insensitive" } }, { email: { contains: email, mode: "insensitive" } }] }
        })
    }

    async createUsuario(data): Promise<Usuarios> {
        return this.prismaService.usuarios.create({
            data: {
                nombre: data.nombre,
                email: data.email,
            }
        })
    }

    async updateUsuario(data): Promise<Usuarios> {

        await this.getUsuarioById(data.usuario_id);

        return this.prismaService.usuarios.update({
            where: { usuario_id: data.usuario_id },
            data: {
                nombre: data.nombre,
                email: data.email,
            }
        })
    }

    async deleteUsuario(usuario_id): Promise<Usuarios> {

        await this.getUsuarioById(usuario_id);

        return this.prismaService.usuarios.delete({
            where: { usuario_id: usuario_id },
        })
    }

}