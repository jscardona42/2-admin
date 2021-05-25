import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(private prismaService: PrismaService) { }

  async getRoles(): Promise<Role[]> {
    return this.prismaService.roles.findMany();
  }

}
