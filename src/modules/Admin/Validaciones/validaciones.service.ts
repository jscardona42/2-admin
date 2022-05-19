import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';

@Injectable()
export class ValidacionesService {
    constructor(private prismaService: PrismaService) { }

    // Esta función permite almacenar en BD el nombre las validaciones
    async createValidacion(referencia: any): Promise<any> {

        // Filtramos el nombre de los métodos que contengan las palabras create, update o add.
        var metodos = referencia.resolver.methods.filter(
            item => item.startsWith("create") || item.startsWith("update") || item.startsWith("add")
        )

        // Obtenemos el id_referenciado del nombre del método que contiene el @ResolverField()
        var ids = referencia.id_referenciado.split("Referencia")[0];
        var id_referenciado = ids.split("And")[0];
        var id_query = ids.split("And")[1];
        if (id_query === undefined) {
            id_query = id_referenciado;
        }

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
                id_query: id_query,
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
}