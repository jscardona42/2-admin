import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreatePerfilInput, FilterPerfilesInput, UpdatePerfilInput } from './dto/perfiles.dto';
import { FormulariosEmpresasService } from '../FormulariosEmpresas/formulariosempresas.service';

@Injectable()
export class PerfilesService {
    constructor(
        private prismaService: PrismaService,
        private formulariosEmpresasService: FormulariosEmpresasService,
        private formulariosEmpresas: FormulariosEmpresasService,
    ) { }

    async getPerfiles(): Promise<any[]> {
        return this.prismaService.perfiles.findMany({
            include: { FormulariosPerfilesSec: { include: { FormulariosEmpresas: true } }, FuncionalidadesPerfilesSec: true, UsuariosPerfiles: true }
        });
    }

    async getPerfilById(perfil_id: number): Promise<any> {
        let perfil = await this.prismaService.perfiles.findUnique({
            where: { perfil_id: perfil_id },
            include: { FormulariosPerfilesSec: { include: { FormulariosEmpresas: true } }, FuncionalidadesPerfilesSec: true, UsuariosPerfiles: true }
        });

        if (perfil === null) {
            throw new UnauthorizedException(`El perfil con id ${perfil_id} no existe`);
        }
        return perfil;
    }

    async getFilterPerfiles(data: FilterPerfilesInput): Promise<any[]> {
        return this.prismaService.perfiles.findMany({
            where: {
                OR:
                    [
                        { nombre: { contains: data.nombre, mode: "insensitive" } },
                        { personalizado: { equals: data.personalizado } }
                    ]
            },
            include: { FormulariosPerfilesSec: { include: { FormulariosEmpresas: true } }, FuncionalidadesPerfilesSec: true, UsuariosPerfiles: true }
        })
    }

    async createPerfil(data: CreatePerfilInput): Promise<any> {


        let createFormulariosPerfiles = [];
        let createFuncionalidadesPerfiles = [];

        if (data.FormulariosPerfiles !== undefined) {
            if (data.FormulariosPerfiles.length > 0) {
                await data.FormulariosPerfiles.reduce(async (promise0, formulariosperfiles) => {
                    await promise0;

                    await this.formulariosEmpresasService.getFormularioEmpresaById(formulariosperfiles.formulario_empresa_id)

                    createFormulariosPerfiles.push({
                        formulario_empresa_id: formulariosperfiles.formulario_empresa_id
                    }
                    )
                }, Promise.resolve());
            }
        }

        if (data.FuncionalidadesPerfiles !== undefined) {
            if (data.FuncionalidadesPerfiles.length > 0) {
                await data.FuncionalidadesPerfiles.reduce(async (promise0, funcionalidadesPerfiles) => {
                    await promise0;

                    createFuncionalidadesPerfiles.push({
                        funcionalidad_id: funcionalidadesPerfiles.funcionalidad_id
                    }
                    )
                }, Promise.resolve());
            }
        }

        try {
            return await this.prismaService.perfiles.create({
                data: {
                    nombre: data.nombre,
                    descripcion: data.descripcion,
                    personalizado: data.personalizado,
                    codigo: data.codigo,
                    estado: data.estado,
                    FuncionalidadesPerfilesSec: {
                        create: createFuncionalidadesPerfiles
                    },
                    FormulariosPerfilesSec: {
                        create: createFormulariosPerfiles
                    }
                },
                include: { FormulariosPerfilesSec: { include: { FormulariosEmpresas: true } }, FuncionalidadesPerfilesSec: true, UsuariosPerfiles: true }
            })
        } catch (error) {
            if (error.code === 'P2002') {
                throw new UnauthorizedException(`El ${error.meta.target[0]} ya se encuentra registrado`);
            }
        }
    }

    async updatePerfil(data: UpdatePerfilInput): Promise<any> {

        let funcionalidadesPerfiles = [];
        let formulariosPerfiles = [];

        let createFuncionalidadesPerfiles = [];
        let createFormulariosPerfiles = [];
        let idsBorradosFuncionalidadesPerfiles = [];
        let idsCreadosFuncionalidadesPerfiles = [];
        let idsBorradosFormulariosPerfiles = [];
        let idsCreadosFormulariosPerfiles = [];
        let updatePerfiles = [];

        await this.getPerfilById(data.perfil_id);

        if (data.FormulariosPerfiles !== undefined) {
            formulariosPerfiles = data.FormulariosPerfiles;

        }
        if (data.FuncionalidadesPerfiles !== undefined) {
            funcionalidadesPerfiles = data.FuncionalidadesPerfiles;
        }

        let formulariosPerfilesExistentes = await this.prismaService.perfiles.findMany({
            where: { perfil_id: data.perfil_id },
            select: {
                FormulariosPerfilesSec: {
                    select: {
                        formulario_empresa_id: true
                    }
                }
            }
        })

        if (formulariosPerfilesExistentes.length > 0) {
            let ids = await this.buildArrayCoincidencias(formulariosPerfilesExistentes, formulariosPerfiles, "FormulariosPerfiles");
            idsBorradosFormulariosPerfiles = ids.idsBorrados;
            idsCreadosFormulariosPerfiles = ids.idsCreados;
        }

        await formulariosPerfiles.reduce(async (promise01, formulariosPerfiles) => {
            await promise01;

            await this.formulariosEmpresas.getFormularioEmpresaById(formulariosPerfiles.formulario_empresa_id);

            if (idsCreadosFormulariosPerfiles.includes(formulariosPerfiles.formulario_empresa_id)) {

                createFormulariosPerfiles.push({
                    formulario_empresa_id: formulariosPerfiles.formulario_empresa_id
                });
            }

        }, Promise.resolve());


        let funcionalidadesPerfilesExistentes = await this.prismaService.perfiles.findMany({
            where: { perfil_id: data.perfil_id },
            select: {
                FuncionalidadesPerfilesSec: {
                    select: {
                        funcionalidad_id: true
                    }
                }
            }
        })

        if (funcionalidadesPerfilesExistentes.length > 0) {
            let ids = await this.buildArrayCoincidencias(funcionalidadesPerfilesExistentes, funcionalidadesPerfiles, "FuncionalidadesPerfiles");
            idsBorradosFuncionalidadesPerfiles = ids.idsBorrados;
            idsCreadosFuncionalidadesPerfiles = ids.idsCreados;
        }

        await funcionalidadesPerfiles.reduce(async (promise01, funcionalidadesPerfiles) => {
            await promise01;

            if (idsCreadosFuncionalidadesPerfiles.includes(funcionalidadesPerfiles.funcionalidad_id)) {
                createFuncionalidadesPerfiles.push({
                    funcionalidad_id: funcionalidadesPerfiles.funcionalidad_id
                });
            }

        }, Promise.resolve());


        updatePerfiles.push(this.prismaService.perfiles.update({
            where: { perfil_id: data.perfil_id },
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion,
                personalizado: data.personalizado,
                codigo: data.codigo,
                estado: data.estado,
                FormulariosPerfilesSec: {
                    create: createFormulariosPerfiles
                },
                FuncionalidadesPerfilesSec: {
                    create: createFuncionalidadesPerfiles
                }
            },
            include: { FormulariosPerfilesSec: { include: { FormulariosEmpresas: true } }, FuncionalidadesPerfilesSec: true, UsuariosPerfiles: true }
        }))

        idsBorradosFuncionalidadesPerfiles.forEach(e => {
            updatePerfiles.push(this.prismaService.funcionalidadesPerfiles.deleteMany({
                where: {
                    funcionalidad_id: {
                        in: idsBorradosFuncionalidadesPerfiles
                    }, perfil_id: data.perfil_id
                }
            })
            )
        });

        idsBorradosFormulariosPerfiles.forEach(e => {
            updatePerfiles.push(this.prismaService.formulariosPerfiles.deleteMany({
                where: {
                    formulario_empresa_id: {
                        in: idsBorradosFormulariosPerfiles
                    }, perfil_id: data.perfil_id
                }
            })
            )
        });

        try {
            let transaction = await this.prismaService.$transaction(updatePerfiles)
            return transaction[0]

        } catch (error) {
            if (error.code === 'P2002') {
                throw new UnauthorizedException(`El ${error.meta.target[0]} ya se encuentra registrado`);
            }
        }
    }

    async buildArrayCoincidencias(formulariosExistentes: any, data: any, key: String): Promise<any> {

        let idsExistentes = [];
        let idsEnviados = [];

        if (key === "FuncionalidadesPerfiles") {
            formulariosExistentes.map((e) => {
                e.FuncionalidadesPerfilesSec.map((e) => {
                    idsExistentes.push(e.funcionalidad_id)
                })

            })

            data.map((e) => {
                idsEnviados.push(e.funcionalidad_id)
            })
        }

        else if (key === "FormulariosPerfiles") {
            formulariosExistentes.map((e) => {
                e.FormulariosPerfilesSec.map((e) => {
                    idsExistentes.push(e.formulario_empresa_id)
                })

            })

            data.map((e) => {
                idsEnviados.push(e.formulario_empresa_id)
            })
        }

        let idsEstaticos = idsExistentes.filter(x => idsEnviados.includes(x));
        let idsBorrados = idsExistentes.filter((e) => !idsEstaticos.includes(e));
        let idsCreados = idsEnviados.filter((e) => !idsEstaticos.includes(e));

        return { idsBorrados, idsCreados }
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


    async deletePerfil(perfil_id: number) {
        return this.prismaService.perfiles.update({
            where: { perfil_id: perfil_id },
            data: { estado: "INACTIVO" }, include: { FormulariosPerfilesSec: { include: { FormulariosEmpresas: true } }, FuncionalidadesPerfilesSec: true, UsuariosPerfiles: true }
        });
    }
}
