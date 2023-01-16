import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { FormulariosEmpresas } from './entities/formulariosempresas.entity';
import { CreateFormularioEmpresaInput, FilterFormulariosEmpresasInput, UpdateFormularioEmpresaInput } from './dto/formulariosempresas.dto';

@Injectable()
export class FormulariosEmpresasService {
    constructor(
        private prismaService: PrismaService,
    ) { }

    async getFormulariosEmpresas(): Promise<FormulariosEmpresas[]> {
        return this.prismaService.formulariosEmpresas.findMany({
            where: { estado: true },
            include: { FormulariosPerfiles: true },
            orderBy: { formulario_empresa_id: "asc" }
        });
    }

    async getFormularioEmpresaById(formulario_empresa_id: number): Promise<FormulariosEmpresas> {
        let formularioempresa = await this.prismaService.formulariosEmpresas.findUnique({
            where: { formulario_empresa_id: formulario_empresa_id },
            include: { FormulariosPerfiles: true }
        });

        if (formularioempresa === null) {
            throw new UnauthorizedException(`El formulario empresa con id ${formulario_empresa_id} no existe`);
        }
        return formularioempresa;
    }

    async getFilterFormulariosEmpresas(data: FilterFormulariosEmpresasInput): Promise<FormulariosEmpresas[]> {
        return this.prismaService.formulariosEmpresas.findMany({
            where: {
                OR:
                    [
                        { estado: { equals: data.estado } }
                    ]
            },
            include: { FormulariosPerfiles: true }
        })
    }

    async createFormularioEmpresa(data: CreateFormularioEmpresaInput): Promise<FormulariosEmpresas> {

        return this.prismaService.formulariosEmpresas.create({
            data: {
                formulario_gestion_id: data.formulario_gestion_id,
                estado: data.estado
            },
            include: { FormulariosPerfiles: true }
        })
    }

    async updateFormularioEmpresa(data: UpdateFormularioEmpresaInput): Promise<FormulariosEmpresas> {

        await this.getFormularioEmpresaById(data.formulario_empresa_id)

        return this.prismaService.formulariosEmpresas.update({
            where: { formulario_empresa_id: data.formulario_empresa_id },
            data: {
                formulario_gestion_id: data.formulario_gestion_id,
                estado: data.estado
            },
            include: { FormulariosPerfiles: true }
        })
    }

    async deleteFormularioEmpresa(formulario_empresa_id: number): Promise<FormulariosEmpresas> {

        await this.getFormularioEmpresaById(formulario_empresa_id)

        return this.prismaService.formulariosEmpresas.update({
            where: { formulario_empresa_id: formulario_empresa_id },
            data: {
                estado: false
            }
        })
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
