import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Auditorias } from './entities/auditorias.entity';


@Injectable()
export class AuditoriasService {
  constructor(private prismaService: PrismaService) { }

  async getAuditorias(): Promise<Auditorias[]> {
    return await this.prismaService.auditorias.findMany({
    })
  }

  async registerAuditoria(data): Promise<void> {
    var status: string;
    var profile: string;
    var has_Twofactor = false;

    if (data.usuario_id !== undefined) {
      var role = await this.prismaService.roles.findFirst({
        where: { rol_id: data.role_id }
      })

      profile = role.rol_id + "-" + role.rol;
      has_Twofactor = data.active_two_factor;
      status = "authorized";
    } else {
      status = "unauthorized";
    }
    await this.prismaService.auditorias.create({
      data: { login_id: data.id, status: status, tipo: "signin", username: data.username, rol: profile, tiene_doble_factor: has_Twofactor }
    })
  }
}