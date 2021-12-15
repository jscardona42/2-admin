import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { CreateMicroservicioInput, UpdateMicroservicioInput } from './dto/microservicios.dto';
import { Microservicios } from './entities/microservicios.entity';


@Injectable()
export class MicroserviciosService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async getMicroservicios(): Promise<any[]> {
        return this.prismaService.microservicios.findMany({
            include: { ProveedoresServiciosSec: true }
        });
    }

    async getMicroservicioById(microservicio_id: number): Promise<any> {
        var microservicios = await this.prismaService.microservicios.findUnique({
            where: { microservicio_id: microservicio_id },
            include: { ProveedoresServiciosSec: true }
        });

        if (microservicios === null) {
            throw new UnauthorizedException(`El microservicio con id ${microservicio_id} no existe`);
        }

        return microservicios;
    }

    async getFilterMicroservicios(name: string): Promise<any[]> {
        return this.prismaService.microservicios.findMany({
            where: { OR: [{ name: { contains: name, mode: "insensitive" } }] },
            include: { ProveedoresServiciosSec: true }
        })
    }

    async createMicroservicio(data: CreateMicroservicioInput): Promise<any> {
        return this.prismaService.microservicios.create({
            data: {
                name: data.name,
                url: data.url,
                activo: data.activo
            },
            include: { ProveedoresServiciosSec: true }
        });
    }

    async updateMicroservicio(data: UpdateMicroservicioInput): Promise<any> {

        await this.getMicroservicioById(data.microservicio_id);

        return this.prismaService.microservicios.update({
            where: { microservicio_id: data.microservicio_id },
            data: {
                name: data.name,
                url: data.url,
                activo: data.activo
            },
            include: { ProveedoresServiciosSec: true }
        });
    }

    async deleteMicroservicio(microservicio_id: number): Promise<any> {

        await this.getMicroservicioById(microservicio_id);

        return this.prismaService.microservicios.delete({
            where: { microservicio_id: microservicio_id },
            include: { ProveedoresServiciosSec: true }
        });
    }
}
