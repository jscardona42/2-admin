import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UsuariosHistoricoContrasenas } from './entities/usuariohistoricocontrasenas.entity';

@Injectable()
export class UsuariosHistoricoContrasenasService {
    constructor(
        private prismaService: PrismaService,
    ) { }

    async getUsuariosHistoricoContrasenas(): Promise<UsuariosHistoricoContrasenas[]> {
        return this.prismaService.usuariosHistoricoContrasenas.findMany({
        });
    }

    async getUsuarioHistoricoContrasenaById(usu_historico_contrasena_id: number): Promise<UsuariosHistoricoContrasenas> {
        let usuariohistoricocontrasena = await this.prismaService.usuariosHistoricoContrasenas.findUnique({
            where: { usu_historico_contrasena_id: usu_historico_contrasena_id },
            include: { Usuarios: true}
        });

        if (usuariohistoricocontrasena === null) {
            throw new UnauthorizedException(`El usuario historico contrasena con id ${usu_historico_contrasena_id} no existe`);
        }
        return usuariohistoricocontrasena;
    }

}
