import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from "@nestjs/jwt";
import { AuditoriasService } from 'src/Auditorias/auditorias.service';
import { Usuarios } from '../Usuarios/entities/usuarios.entity';


@Injectable()
export class UsuariosService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private auditService: AuditoriasService
    ) { }

    async getUsuarios(): Promise<Usuarios[]> {
        return this.prismaService.usuarios.findMany();
    }

    async getUsuarioById(usuario_id: number) {
        return this.prismaService.usuarios.findUnique({
            where: { usuario_id: usuario_id },
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
        return this.prismaService.usuarios.update({
            where: { usuario_id: data.usuario_id },
            data: {
                nombre: data.nombre,
                email: data.email,
            }
        })
    }

    async deleteUsuario(usuario_id): Promise<Usuarios> {
        return this.prismaService.usuarios.delete({
            where: { usuario_id: usuario_id },
        })
    }

}