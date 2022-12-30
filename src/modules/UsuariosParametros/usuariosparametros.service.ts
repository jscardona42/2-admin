import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UsuariosParametros } from './entities/usuariosparametros.entity';
import { CreateUsuarioParametroInput, FilterUsuariosParametrosInput, UpdateUsuarioParametroInput } from './dto/usuariosparametros.dto';

@Injectable()
export class UsuariosParametrosService {
    constructor(
        private prismaService: PrismaService,
    ) { }

    async getUsuariosParametros(): Promise<UsuariosParametros[]> {
        return this.prismaService.usuariosParametros.findMany({
            include: { UsuariosParametrosValoresSec: true }
        });
    }

    async getUsuarioParametroById(usuario_parametro_id: number): Promise<UsuariosParametros> {
        let usuarioparametro = await this.prismaService.usuariosParametros.findUnique({
            where: { usuario_parametro_id: usuario_parametro_id },
            include: { UsuariosParametrosValoresSec: true }
        });

        if (usuarioparametro === null) {
            throw new UnauthorizedException(`El usuario parametro con id ${usuario_parametro_id} no existe`);
        }
        return usuarioparametro;
    }

    async getFilterUsuariosParametrosInput(data: FilterUsuariosParametrosInput): Promise<UsuariosParametros[]> {
        return this.prismaService.usuariosParametros.findMany({
            where: {
                OR:
                    [
                        { nombre: { contains: data.nombre, mode: "insensitive" } }
                    ]
            },
            include: { UsuariosParametrosValoresSec: true }
        })
    }

    async createUsuarioParametro(data: CreateUsuarioParametroInput): Promise<any> {

        return this.prismaService.usuariosParametros.create({
            data: {
                nombre: data.nombre,
                alias: data.alias,
                requerido: data.requerido,
                valor_defecto: data.valor_defecto,
                descripcion: data.descripcion
            },
            include: { UsuariosParametrosValoresSec: true }
        })
    }

    async updateUsuarioParametro(data: UpdateUsuarioParametroInput): Promise<UsuariosParametros> {

        await this.getUsuarioParametroById(data.usuario_parametro_id)

        return this.prismaService.usuariosParametros.update({
            where: { usuario_parametro_id: data.usuario_parametro_id },
            data: {
                nombre: data.nombre,
                alias: data.alias,
                requerido: data.requerido,
                valor_defecto: data.valor_defecto,
                descripcion: data.descripcion,
                
            },
            include: { UsuariosParametrosValoresSec: true }
        })
    }
}
