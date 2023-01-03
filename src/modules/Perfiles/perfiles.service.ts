import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { AddFormulariosPerfilesToPerfilInput, CreatePerfilInput, FilterPerfilesInput, UpdatePerfilInput } from './dto/perfiles.dto';
import { Perfiles } from './entities/perfiles.entity';
import { FormulariosEmpresasService } from '../FormulariosEmpresas/formulariosempresas.service';

@Injectable()
export class PerfilesService {
    constructor(
        private prismaService: PrismaService,
        private formulariosEmpresasService: FormulariosEmpresasService,
        private formulariosEmpresas: FormulariosEmpresasService
    ) { }

    async getPerfiles(): Promise<Perfiles[]> {
        return this.prismaService.perfiles.findMany({
            include: { FormulariosPerfiles: true, FuncionalidadesPerfiles: true, UsuariosPerfiles: true }
        });
    }

    async getPerfilById(perfil_id: number): Promise<Perfiles> {
        let perfil = await this.prismaService.perfiles.findUnique({
            where: { perfil_id: perfil_id },
            include: { FormulariosPerfiles: true, FuncionalidadesPerfiles: true, UsuariosPerfiles: true }
        });

        if (perfil === null) {
            throw new UnauthorizedException(`El perfil con id ${perfil_id} no existe`);
        }
        return perfil;
    }

    async getFilterPerfiles(data: FilterPerfilesInput): Promise<Perfiles[]> {
        return this.prismaService.perfiles.findMany({
            where: {
                OR:
                    [
                        { nombre: { contains: data.nombre, mode: "insensitive" } },
                        { personalizado: { equals: data.personalizado } }
                    ]
            },
            include: { FormulariosPerfiles: true, FuncionalidadesPerfiles: true, UsuariosPerfiles: true }
        })
    }

    async createPerfil(data: CreatePerfilInput): Promise<Perfiles> {

        let create = [];
        if (data.FormulariosPerfiles !== undefined) {
            await data.FormulariosPerfiles.reduce(async (promise0, formulariosperfiles) => {
                await promise0;

                await this.formulariosEmpresasService.getFormularioEmpresaById(formulariosperfiles.formulario_empresa_id)

                create.push({
                    formulario_empresa_id: formulariosperfiles.formulario_empresa_id
                }
                )
            }, Promise.resolve());
        }

        return this.prismaService.perfiles.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                personalizado: data.personalizado,
                FormulariosPerfiles: {
                    create: create
                }
            },
            include: { FormulariosPerfiles: true, FuncionalidadesPerfiles: true, UsuariosPerfiles: true }
        })
    }

    async updatePerfil(data: UpdatePerfilInput): Promise<Perfiles> {

        await this.getPerfilById(data.perfil_id)

        let update = [];

        if (data.FormulariosPerfiles !== undefined) {
            await data.FormulariosPerfiles.reduce(async (promise0, formulariosperfiles) => {
                await promise0;

                await this.getFormularioPerfilById(formulariosperfiles.formulario_perfil_id);
                await this.formulariosEmpresasService.getFormularioEmpresaById(formulariosperfiles.formulario_empresa_id)


                update.push({
                    where: {
                        formulario_perfil_id: formulariosperfiles.formulario_perfil_id
                    },
                    data: {
                        formulario_empresa_id: formulariosperfiles.formulario_empresa_id
                    }
                }
                )
            }, Promise.resolve());
        }

        return this.prismaService.perfiles.update({
            where: { perfil_id: data.perfil_id },
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                personalizado: data.personalizado,
                FormulariosPerfiles: {
                    update: update
                }
            },
            include: { FormulariosPerfiles: true, FuncionalidadesPerfiles: true, UsuariosPerfiles: true }
        })
    }

    async getFormularioPerfilById(formulario_perfil_id: number): Promise<any> {

        let formularioperfil = await this.prismaService.formulariosPerfiles.findUnique({
            where: { formulario_perfil_id: formulario_perfil_id },
            include: {
                FormulariosEmpresas: true, Perfiles: true
            }
        })

        if (formularioperfil === null) {
            throw new UnauthorizedException(`El formulario perfil con id ${formulario_perfil_id} no existe`);
        }
        return formularioperfil;

    }

    async AddFormulariosPerfilesToPerfil(data: AddFormulariosPerfilesToPerfilInput): Promise<any> {

        let create = [];

        await this.getPerfilById(data.perfil_id)

        if (data.FormulariosPerfiles !== undefined) {
            await data.FormulariosPerfiles.reduce(async (promise0, formularioperfil) => {
                await promise0;

                await this.formulariosEmpresas.getFormularioEmpresaById(formularioperfil.formulario_empresa_id)

                create.push({
                    formulario_empresa_id: formularioperfil.formulario_empresa_id
                })

            }, Promise.resolve());
        }

        return this.prismaService.perfiles.update({
            where: { perfil_id: data.perfil_id },
            data: {
                FormulariosPerfiles: {
                    create: create
                }
            },
            include: {
                FormulariosPerfiles: true, FuncionalidadesPerfiles: true, UsuariosPerfiles: true
            }
        })
    }
}
