import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UpdateValidacionInput } from './dto/validaciones.dto';
import { Validaciones } from './entities/validaciones.entity';

@Injectable()
export class ValidacionesService {
    constructor(private prismaService: PrismaService) { }


    async getValidaciones(): Promise<Validaciones[]> {
        return this.prismaService.validaciones.findMany({
            include: { Microservicios: true, PermisosValidaciones: { include: { Permisos: true } } }
        });
    }

    async getValidacioneById(validacion_id: number): Promise<Validaciones> {
        return this.prismaService.validaciones.findUnique({
            where: { validacion_id: validacion_id },
            include: { Microservicios: true, PermisosValidaciones: { include: { Permisos: true } } }
        });
    }

    async createValidacion(referencia: any): Promise<any> {

        var metodos = referencia.resolver.methods.filter(
            item => item.startsWith("create") || item.startsWith("update")
        )

        var id_referenciado = referencia.id_referenciado.split("Referencia")[0];
        var servicio = referencia.id_referenciado.split("Referencia")[1].replace("Referencia", "");

        var servicio_id = await this.prismaService.microservicios.findFirst({
            where: { name: servicio.toLowerCase() },
            select: { microservicio_id: true }
        })

        var permisos = await this.prismaService.permisos.findMany({
            where: { permiso: { in: metodos } },
            select: { permiso_id: true }
        })

        var validacion = await this.prismaService.validaciones.findFirst({
            where: { id_referenciado: id_referenciado },
            select: { validacion_id: true }
        })

        if (validacion === null) {
            validacion = { validacion_id: 0 }
        }

        var validacion_id = await this.prismaService.validaciones.upsert({
            where: { validacion_id: validacion.validacion_id },
            update: {
                id_referenciado: id_referenciado,
                microservicio_id: servicio_id.microservicio_id
            },
            create: {
                id_referenciado: id_referenciado,
                microservicio_id: servicio_id.microservicio_id
            }
        });

        this.createPermisoValidacion(permisos, validacion_id);

        return validacion;
    }

    async createPermisoValidacion(permisos, validacion_id) {
        var permisosExistentes;

        permisos.forEach(async permiso => {
            permisosExistentes = await this.prismaService.permisosValidaciones.findFirst({
                where: { permiso_id: permiso.permiso_id },
                select: { permiso_id: true }
            })

            if (permisosExistentes === null) {
                await this.prismaService.permisosValidaciones.create({
                    data: {
                        permiso_id: permiso.permiso_id,
                        validacion_id: validacion_id.validacion_id
                    }
                });
            }
        });
    }

    async updateValidacion(data: UpdateValidacionInput): Promise<Validaciones> {
        return this.prismaService.validaciones.update({
            where: { validacion_id: data.validacion_id },
            data: {
                ...data
            },
            include: { Microservicios: true, PermisosValidaciones: { include: { Permisos: true } } }
        })
    }

    async deleteValidacion(validacion_id: number): Promise<Validaciones> {
        return this.prismaService.validaciones.delete({
            where: { validacion_id: validacion_id },
            include: { Microservicios: true, PermisosValidaciones: { include: { Permisos: true } } }
        })
    }
}