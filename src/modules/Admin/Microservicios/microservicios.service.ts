import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { CreateMicroservicioInput, UpdateMicroservicioInput } from './dto/microservicios.dto';
import { Microservicios } from './entities/microservicios.entity';


@Injectable()
export class MicroserviciosService {
    constructor(
        private prismaService: PrismaService
    ) { }

    async getMicroservicios(): Promise<Microservicios[]> {
        return this.prismaService.microservicios.findMany();
    }

    async getMicroservicioById(microservicio_id: number): Promise<Microservicios> {
        var microservicios = await this.prismaService.microservicios.findUnique({
            where: { microservicio_id: microservicio_id }
        });

        if (microservicios === null) {
            throw new UnauthorizedException(`El microservicio con id ${microservicio_id} no existe`);
        }

        return microservicios;
    }

    async getFilterMicroservicios(name: string): Promise<Microservicios[]> {
        return this.prismaService.microservicios.findMany({
            where: { OR: [{ name: { contains: name, mode: "insensitive" } }] }
        })
    }

    async createMicroservicio(data: CreateMicroservicioInput): Promise<Microservicios> {
        return this.prismaService.microservicios.create({
            data: {
                name: data.name,
                url: data.url,
                activo: data.activo
            }
        });
    }

    async updateMicroservicio(data: UpdateMicroservicioInput): Promise<Microservicios> {

        await this.getMicroservicioById(data.microservicio_id);

        return this.prismaService.microservicios.update({
            where: { microservicio_id: data.microservicio_id },
            data: {
                name: data.name,
                url: data.url,
                activo: data.activo
            }
        });
    }

    async deleteMicroservicio(microservicio_id: number): Promise<Microservicios> {

        await this.getMicroservicioById(microservicio_id);

        return this.prismaService.microservicios.delete({
            where: { microservicio_id: microservicio_id }
        });
    }
}
