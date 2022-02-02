import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntidadesService } from 'src/modules/Admin/Entidades/entidades.service';
import { PrismaService } from '../../../prisma.service';
import { PermisosService } from '../Permisos/permisos.service';
import { AddPermisosToFuncionalidadInput, CreateFuncionalidadInput, FilterFuncionalidadesInput, UpdateFuncionalidadInput } from './dto/funcionalidades.dto';

@Injectable()
export class FuncionalidadesService {
    constructor(
        private prismaService: PrismaService,
        private permisosService: PermisosService,
        private entidadesService: EntidadesService
    ) { }

    async getFuncionalidades(): Promise<any[]> {
        return this.prismaService.funcionalidades.findMany({
            include: { Entidades: true, FuncionalidadesPermisosSec: true, RolesFuncionalidades: true }
        });
    }

    async getFuncionalidadById(funcionalidad_id: number): Promise<any> {
        return this.prismaService.funcionalidades.findUnique({
            where: { funcionalidad_id: funcionalidad_id },
            include: { Entidades: true, FuncionalidadesPermisosSec: true, RolesFuncionalidades: true },
            rejectOnNotFound: () => new UnauthorizedException(`La funcionalidad con id ${funcionalidad_id} no existe`)
        });
    }

    async getFilterFuncionalidades(data: FilterFuncionalidadesInput): Promise<any[]> {
        return this.prismaService.funcionalidades.findMany({
            where: { OR: [{ nombre: { contains: data.nombre, mode: "insensitive" } }, { Entidades: { nombre: { contains: data.entidad_nombre } } }] },
            include: { Entidades: true, FuncionalidadesPermisosSec: true, RolesFuncionalidades: true }
        });
    }

    async createFuncionalidad(data: CreateFuncionalidadInput): Promise<any> {
        await this.entidadesService.getEntidadeById(data.entidad_id);
        await Promise.all(data.FuncionalidadesPermisos.map(async (element) => {
            await this.permisosService.getPermisoById(element.permiso_id);
            await this.validatePermisosByEntidadIdAndPermisoId(element, data.entidad_id);
        }));

        return this.prismaService.funcionalidades.create({
            data: {
                nombre: data.nombre,
                entidad_id: data.entidad_id,
                FuncionalidadesPermisosSec: { create: data.FuncionalidadesPermisos }
            },
            include: { Entidades: true, FuncionalidadesPermisosSec: true, RolesFuncionalidades: true }
        });
    }

    async updateFuncionalidad(data: UpdateFuncionalidadInput): Promise<any> {
        let updateFuncionalidadesPermisos = [];

        await Promise.all(data.FuncionalidadesPermisos.map(async (element, i) => {
            await this.permisosService.getPermisoById(element.permiso_id);
            let funcionalidad = await this.getFuncionalidadById(data.funcionalidad_id);
            await this.validatePermisosByEntidadIdAndPermisoId(element, funcionalidad.entidad_id);
            await this.validateFuncionalidadPermiso(element, data);
        }));

        data.FuncionalidadesPermisos.forEach(element => {
            updateFuncionalidadesPermisos.push({
                where: { funcionalidad_permiso_id: element.funcionalidad_permiso_id },
                data: { permiso_id: element.permiso_id }
            })
        });

        return this.prismaService.funcionalidades.update({
            where: { funcionalidad_id: data.funcionalidad_id },
            data: {
                nombre: data.nombre,
                FuncionalidadesPermisosSec: {
                    update: updateFuncionalidadesPermisos
                }
            },
            include: { Entidades: true, FuncionalidadesPermisosSec: true, RolesFuncionalidades: true }
        });
    }

    async deleteFuncionalidad(funcionalidad_id: number): Promise<any> {
        await this.getFuncionalidadById(funcionalidad_id);

        return this.prismaService.funcionalidades.delete({
            where: { funcionalidad_id: funcionalidad_id },
            include: { Entidades: true, FuncionalidadesPermisosSec: true, RolesFuncionalidades: true }
        });
    }

    async addPermisosToFuncionalidad(data: AddPermisosToFuncionalidadInput): Promise<any> {

        await Promise.all(data.FuncionalidadesPermisos.map(async (element, i) => {
            await this.permisosService.getPermisoById(element.permiso_id);
            let funcionalidad = await this.getFuncionalidadById(data.funcionalidad_id);
            await this.validatePermisosByEntidadIdAndPermisoId(element, funcionalidad.entidad_id);
            await this.validatePermisoExists(element, data);
        }));

        return this.prismaService.funcionalidades.update({
            where: { funcionalidad_id: data.funcionalidad_id },
            data: {
                FuncionalidadesPermisosSec: {
                    create: data.FuncionalidadesPermisos
                }
            },
            include: { Entidades: true, FuncionalidadesPermisosSec: true, RolesFuncionalidades: true }
        });
    }

    async getFuncionalidadesPermisosByPermisoId(permiso_id: number) {
        let permiso = await this.prismaService.funcionalidadesPermisos.findFirst({
            where: { permiso_id: permiso_id }
        });

        if (permiso !== null) {
            throw new UnauthorizedException(`El permiso con id ${permiso_id} ya se encuentra registrado`);
        }
    }

    async validateFuncionalidadPermiso(element: any, data: any) {
        let funcionalidadPermiso = await this.prismaService.funcionalidadesPermisos.findUnique({
            where: { funcionalidad_permiso_id: element.funcionalidad_permiso_id },
            include: { Funcionalidades: true },
            rejectOnNotFound: () => new UnauthorizedException(`La funcionalidad permiso con id ${element.funcionalidad_permiso_id} no existe`)
        });

        if (funcionalidadPermiso.funcionalidad_id !== null) {
            if (funcionalidadPermiso.funcionalidad_id !== data.funcionalidad_id) {
                throw new UnauthorizedException(`La funcionalidad permiso con id ${element.funcionalidad_permiso_id} no pertenece a la funcionalidad con id ${data.funcionalidad_id}`)
            }
        }
    }

    async validatePermisosByEntidadIdAndPermisoId(element: any, entidad_id: number) {
        return this.prismaService.permisos.findFirst({
            where: { permiso_id: element.permiso_id, entidad_id: entidad_id },
            include: { Entidades: true },
            rejectOnNotFound: () => new UnauthorizedException(`El permiso con id ${element.permiso_id} no pertenece a la entidad con id ${entidad_id}`)
        });
    }

    async validatePermisoExists(element: any, data: any) {
        let permisos = await this.prismaService.funcionalidadesPermisos.findFirst({
            where: { funcionalidad_id: data.funcionalidad_id, permiso_id: element.permiso_id }
        });

        if (permisos !== null) {
            throw new UnauthorizedException(`El permiso con id ${element.permiso_id} ya se encuentra asociado a la funcionalidad`)
        }
    }
}
