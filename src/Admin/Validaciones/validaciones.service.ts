import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UpdateValidacionInput } from './dto/validaciones.dto';
import { PermisosValidaciones } from './entities/permisosvalidaciones.entity';
import { Validaciones } from './entities/validaciones.entity';

@Injectable()
export class ValidacionesService {
    constructor(private prismaService: PrismaService) { }


    async getValidaciones(): Promise<Validaciones[]> {
        return await this.prismaService.validaciones.findMany({
            include: { Microservicios: true, PermisosValidaciones: { include: { Permisos: { include: { Entidades: true } } } } }
        });
    }

    async getPermisosValidaciones(): Promise<PermisosValidaciones[]> {
        return this.prismaService.permisosValidaciones.findMany({
            include: { Permisos: { include: { Entidades: true } }, Validaciones: true }
        });
    }

    async getValidacionById(validacion_id: number): Promise<Validaciones> {
        var validaciones = await this.prismaService.validaciones.findUnique({
            where: { validacion_id: validacion_id },
            include: { Microservicios: true, PermisosValidaciones: { include: { Permisos: { include: { Entidades: true } } } } }
        });

        if (validaciones === null) {
            throw new UnauthorizedException(`La validación con id ${validacion_id} no existe`);
        }

        return validaciones;
    }

    async getPermisoValidacionById(permiso_validacion_id: number): Promise<PermisosValidaciones> {
        return this.prismaService.permisosValidaciones.findUnique({
            where: { permiso_validacion_id: permiso_validacion_id },
            include: { Permisos: { include: { Entidades: true } }, Validaciones: true }
        });
    }

    // Esta función permite almacenar en BD el nombre las validaciones
    async createValidacion(referencia: any): Promise<any> {

        // Filtramos el nombre de los métodos que contengan las palabras create, update o add.
        var metodos = referencia.resolver.methods.filter(
            item => item.startsWith("create") || item.startsWith("update") || item.startsWith("add")
        )

        // Obtenemos el id_referenciado del nombre del método que contiene el @ResolverField()
        var id_referenciado = referencia.id_referenciado.split("Referencia")[0];
        var servicio = referencia.id_referenciado.split("Referencia")[1].replace("Referencia", "");

        // Obtenemos el id del servicio
        var servicio_id = await this.prismaService.microservicios.findFirst({
            where: { name: servicio.toLowerCase() },
            select: { microservicio_id: true }
        })

        // Obtenemos el id de los permisos con base en el nombre de los métodos obtenidos anteriormente.
        var permisos = await this.prismaService.permisos.findMany({
            where: { permiso: { in: metodos } },
            select: { permiso_id: true }
        })

        // Verificamos si el id de la validación existe.
        var validacion = await this.prismaService.validaciones.findFirst({
            where: { id_referenciado: id_referenciado },
            select: { validacion_id: true }
        })

        if (validacion === null) {
            validacion = { validacion_id: 0 }
        }

        // Insertamos o actualizamos la tabla de Validaciones
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

        // Creamos los PermisosValidaciones
        await this.createPermisoValidacion(permisos, validacion_id);

        return validacion;
    }

    // Esta función permite asociar Permisos a cada validación.
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

        await this.getValidacionById(data.validacion_id);

        return this.prismaService.validaciones.update({
            where: { validacion_id: data.validacion_id },
            data: {
                ...data
            },
            include: { Microservicios: true, PermisosValidaciones: { include: { Permisos: { include: { Entidades: true } } } } }
        })
    }

    async deleteValidacion(validacion_id: number): Promise<Validaciones> {

        await this.getValidacionById(validacion_id);

        return this.prismaService.validaciones.delete({
            where: { validacion_id: validacion_id },
            include: { Microservicios: true, PermisosValidaciones: { include: { Permisos: { include: { Entidades: true } } } } }
        })
    }
}