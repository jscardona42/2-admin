import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class EntidadesService {
  constructor(private prismaService: PrismaService) { }

  async createEntidad(cls): Promise<any> {

    var permissions_principal = await this.prismaService.entidades.findFirst({
      where: { resolver: cls.name }
    })

    if (permissions_principal === null) {
      return this.prismaService.entidades.create({
        data: { resolver: cls.name, nombre: cls.name.replace("Resolver", "") },
      });
    }

    return permissions_principal;
  }
}
