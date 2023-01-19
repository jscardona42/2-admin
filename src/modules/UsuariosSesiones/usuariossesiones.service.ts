import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UsuariosSesiones } from './entities/usuariosesiones.entity';

@Injectable()
export class UsuariosSesionesService {
    constructor(
        private prismaService: PrismaService,
    ) { }

    async getUsuariosSesiones(): Promise<UsuariosSesiones[]> {
        return this.prismaService.usuariosSesiones.findMany({
        });
    }
 
    async getUsuarioSesionById(usuario_sesion_id: number): Promise<UsuariosSesiones> {
        let usuariosesion = await this.prismaService.usuariosSesiones.findUnique({
            where: { usuario_sesion_id: usuario_sesion_id },
            include: { Usuarios: true}
        });

        if (usuariosesion === null) {
            throw new UnauthorizedException(`El usuario historico contrasena con id ${usuario_sesion_id} no existe`);
        }
        return usuariosesion;
    }

}
