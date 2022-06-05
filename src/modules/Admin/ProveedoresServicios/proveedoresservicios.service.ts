import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { ProveedoresServicios } from './entities/proveedoresservicios.entity';

@Injectable()
export class ProveedoresServiciosService {
  constructor(private prismaService: PrismaService) { }

  async getProveedoresServicios(): Promise<ProveedoresServicios[]> {
    return this.prismaService.proveedoresServicios.findMany({
      include: { Microservicios: true }
    })
  }

  async getProveedorServicioById(proveedor_servicio_id: number) {
    var proveedores = await this.prismaService.proveedoresServicios.findUnique({
      where: { proveedor_servicio_id: proveedor_servicio_id },
      include: { Microservicios: true }
    })

    if (proveedores === null) {
      throw new UnauthorizedException(`El proveedor servicio con id ${proveedor_servicio_id} no existe`);
    }

    return proveedores;
  }

  // Esta función almacena un listado de Resolver y sus métodos por cada microservicio
  async saveProveedoresServicios(myProviders: any[], microservicio_name: string, modelData: any[] | null): Promise<ProveedoresServicios> {

    let microservicio = await this.prismaService.microservicios.findFirst({
      where: { name: microservicio_name }
    });

    if (microservicio === null) {
      throw new UnauthorizedException("El nombre del microservicio no es correcto");
    }

    var proveedor = await this.prismaService.proveedoresServicios.findFirst({
      where: { microservicio_id: microservicio.microservicio_id }
    })

    try {
      if (proveedor === null) {
        return await this.prismaService.proveedoresServicios.create({
          data: {
            microservicio_id: microservicio.microservicio_id,
            lista_proveedores: JSON.stringify(myProviders),
            model_data: JSON.stringify(modelData)
          },
          include: { Microservicios: true }
        })
      } else {
        return await this.prismaService.proveedoresServicios.update({
          where: { proveedor_servicio_id: proveedor.proveedor_servicio_id },
          data: { lista_proveedores: JSON.stringify(myProviders), model_data: JSON.stringify(modelData) },
          include: { Microservicios: true }
        })
      }
    } catch (e) {
      if (e.code === 'P2002') {
        console.log(`El ${e.meta.target} '${microservicio.microservicio_id}' ya se encuentra registrado`);
      }
    }

  }

  async deleteProveedorServicio(proveedor_servicio_id: number) {

    await this.getProveedorServicioById(proveedor_servicio_id);

    return this.prismaService.proveedoresServicios.delete({
      where: { proveedor_servicio_id: proveedor_servicio_id },
      include: { Microservicios: true }
    })
  }

}