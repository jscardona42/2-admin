import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuditService {
  constructor(private prismaService: PrismaService) { }

  async getAudits() {
    return await this.prismaService.audits.findMany({
    })
  }

  async registerAudit(data, status, req) {
    await this.prismaService.audits.create({
      data: { login_id: data.id, status: status, type: "signin", username: data.username }
    })
  }
}
