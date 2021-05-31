import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { RolesPermisos } from './entities/rolespermisos.entity';

@Injectable()
export class RolesPermisosService {
  constructor(private prismaService: PrismaService) { }


  async getRolesPermisos(): Promise<RolesPermisos[]> {
    return this.prismaService.rolesPermisos.findMany();
  }
}
