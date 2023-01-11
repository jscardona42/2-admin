import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class FuncionalidadesPerfilesService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async getFuncionalidadesPerfiles(): Promise<any[]> {
        return this.prismaService.funcionalidadesPerfiles.findMany({
            include: { Perfiles: { include: { FormulariosPerfilesSec: { include: { FormulariosEmpresas: true } } } } },
            orderBy: { funcionalidad_perfil_id: "asc" }
        });
    }

    async getFuncionalidadPerfilById(funcionalidad_perfil_id: number): Promise<any> {
        let formularioEmpresa = await this.prismaService.funcionalidadesPerfiles.findUnique({
            where: { funcionalidad_perfil_id: funcionalidad_perfil_id },
            include: { Perfiles: { include: { FormulariosPerfilesSec: { include: { FormulariosEmpresas: true } } } } }
        });

        if (formularioEmpresa === null) {
            throw new UnauthorizedException(`La funcionalidad perfil con id ${funcionalidad_perfil_id} no existe`);
        }
        return formularioEmpresa;
    }

    async getFuncionalidadesPerfilesByUsuarioId(usuario_id: number) {
        let funcionalidades = this.prismaService.funcionalidadesPerfiles.findMany({
            where: {
                Perfiles: { UsuariosPerfiles: { some: { usuario_id: usuario_id } } }
            },
            orderBy: { funcionalidad_perfil_id: "asc" }
        });

        return funcionalidades;
    }

}
