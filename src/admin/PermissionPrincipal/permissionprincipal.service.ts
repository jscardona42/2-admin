import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class PermissionPrincipalService {
  constructor(private prismaService: PrismaService) { }

  async createPermissionsPrincipal(cls): Promise<any> {

    var permissions_principal = await this.prismaService.permissions_principal.findFirst({
      where: { name: cls.name }
    })

    if (permissions_principal === null) {
      return this.prismaService.permissions_principal.create({
        data: { name: cls.name },
      });
    }

    return permissions_principal;
  }
}
