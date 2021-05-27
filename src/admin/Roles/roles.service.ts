import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Roles } from './entities/roles.entity';

@Injectable()
export class RolesService {
  constructor(private prismaService: PrismaService) { }

  async getRoles(): Promise<Roles[]> {
    return this.prismaService.roles.findMany();
  }

}
