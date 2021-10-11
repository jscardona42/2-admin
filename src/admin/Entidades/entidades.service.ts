import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UpdateEntidadInput } from './dto/entidades.dto';
import { Entidades } from './entities/entidades.entity';

@Injectable()
export class EntidadesService {
  constructor(private prismaService: PrismaService) { }

  async getEntidades(): Promise<Entidades[]> {
    return this.prismaService.entidades.findMany();
  }

  async getEntidadeById(entidad_id: number): Promise<Entidades> {
    var entidades = await this.prismaService.entidades.findUnique({
      where: { entidad_id: entidad_id }
    });

    if (entidades === null) {
      throw new UnauthorizedException(`La entidad con id ${entidad_id} no existe`);
    }

    return entidades;
  }

  async getFilterEntidades(nombre: string): Promise<Entidades[]> {
    return this.prismaService.entidades.findMany({
      where: { OR: [{ nombre: { contains: nombre, mode: "insensitive" } }] }
    })
  }

  async updateEntidad(data: UpdateEntidadInput) {

    await this.getEntidadeById(data.entidad_id);

    return this.prismaService.entidades.update({
      where: { entidad_id: data.entidad_id },
      data: { nombre: data.nombre, resolver: data.resolver }
    });
  }

  async deleteEntidad(entidad_id: number): Promise<Entidades> {

    await this.getEntidadeById(entidad_id);

    return this.prismaService.entidades.delete({
      where: { entidad_id: entidad_id }
    });
  }


  // Esta función permite almacenar en BD el nombre los resolver
  async createEntidad(cls): Promise<any> {

    var entidades = await this.prismaService.entidades.findFirst({
      where: { resolver: cls.name }
    })

    // Guardamos el nombre de la entidad quitando la palabra Resolver y en otra columna el nombre del resolver
    if (entidades === null) {
      return this.prismaService.entidades.create({
        data: { resolver: cls.name, nombre: cls.name.replace("Resolver", ""), es_entidad: true },
      });
    }

    return entidades;
  }

  async createEntidadExcluida(entidad) {

    var entidad = entidad.replace('PadreSec', '').replace('HijoSec', '').replace('Sec', '');
    var entidades = await this.prismaService.entidades.findFirst({
      where: { nombre: entidad }
    })

    if (entidades === null) {
      return this.prismaService.entidades.create({
        data: { nombre: entidad, es_entidad: false },
      });
    }

    return entidades;
  }
}
