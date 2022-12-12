import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class FormulariosEmpresasService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async getFormulariosEmpresas(): Promise<any[]> {
        return this.prismaService.formulariosEmpresas.findMany({
            include: { FormulariosPerfiles: true }
        });
    }

    async getFormularioEmpresaById(formulario_empresa_id: number): Promise<any> {
        let formularioEmpresa = await this.prismaService.formulariosEmpresas.findUnique({
            where: { formulario_empresa_id: formulario_empresa_id },
            include: { FormulariosPerfiles: true }
        });

        if (formularioEmpresa === null) {
            throw new UnauthorizedException(`El formulario empresa con id ${formulario_empresa_id} no existe`);
        }
        return formularioEmpresa;
    }

    async getFormularioEmpresaByUsuarioId(usuario_id: number) {
        let formularioEmpresa = this.prismaService.formulariosEmpresas.findMany({
            where: {
                FormulariosPerfiles: {
                    some: { Perfiles: { UsuariosPerfiles: { some: { usuario_id: usuario_id } } } }
                }
            }
        });

        return formularioEmpresa;
    }

}
