import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Audit } from './entities/audit.entity';


@Injectable()
export class AuditService {
  constructor(private prismaService: PrismaService) { }

  async getAudits(): Promise<Audit[]> {
    return await this.prismaService.audits.findMany({
    })
  }

  async registerAudit(data): Promise<void> {
    var status: string;
    var profile: string;
    var has_Twofactor = 0;

    if (data.id !== undefined) {
      var role = await this.prismaService.roles.findFirst({
        where: { id: data.role_id }
      })

      profile = role.id + "-" + role.role;
      has_Twofactor = data.active_two_factor;
      status = "authorized";
    } else {
      status = "unauthorized";
    }
    await this.prismaService.audits.create({
      data: { login_id: data.id, status: status, type: "signin", username: data.username, role: profile, has_twofactor: has_Twofactor }
    })
  }
}