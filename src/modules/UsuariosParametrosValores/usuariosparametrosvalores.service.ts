import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UsuariosParametrosValores } from './entities/usuariosparametrosvalores.entity';

@Injectable()
export class UsuariosParametrosValoresService {
    constructor(
        private prismaService: PrismaService,
    ) { }

    async getUsuariosParametrosValores(): Promise<UsuariosParametrosValores[]> {
        return this.prismaService.usuariosParametrosValores.findMany({
            include: { Usuarios: true }
        });
    }

    async getUsuarioParametroValorById(usuario_parametro_valor_id: number): Promise<UsuariosParametrosValores> {
        let usuarioparametrovalor = await this.prismaService.usuariosParametrosValores.findUnique({
            where: { usuario_parametro_valor_id: usuario_parametro_valor_id },
            include: { Usuarios: true}
        });

        if (usuarioparametrovalor === null) {
            throw new UnauthorizedException(`El usuario historico contrasena con id ${usuario_parametro_valor_id} no existe`);
        }
        return usuarioparametrovalor;
    }

}
