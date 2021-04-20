import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { Login } from './login.entity';
import { AuditService } from 'src/audit/audit.service';
var QRCode = require('qrcode')


@Injectable()
export class LoginService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private auditService: AuditService
  ) { }

  async getLogin() {
    return this.prismaService.login.findMany();
  }

  async getLoginById(login_id: number): Promise<Login> {
    return await this.prismaService.login.findUnique({
      where: { id: login_id }
    });
  }

  async getUserById(id: number) {
    return await this.prismaService.users.findUnique({
      where: { id: id }
    });
  }

  async signInLogin(data, req) {
    const salt = await this.prismaService.login.findFirst({
      where: { username: data.username },
      select: { salt: true },
    })

    if (salt === null) {
      this.auditService.registerAudit(data, "unauthorized", req);
      throw new AuthenticationError('Invalid credentials');
    }

    const user = await this.prismaService.login.findFirst({
      where: {
        username: data.username,
        password: await this.hashPassword(data.password, salt.salt)
      },
    })

    const permiss = await this.prismaService.roles_permissions.findFirst({
      where: { role_id: user.role_id },
      select: { permissions: true }
    })

    if (!user) {
      this.auditService.registerAudit(data, "unauthorized", req);
      throw new AuthenticationError('Invalid credentials');
    }

    this.auditService.registerAudit(user, "authorized", req);

    const token = this.jwtService.sign({ userId: user.id });
    const updToken = this.createToken(token, user);

    return updToken;
  }

  async signUpLogin(data): Promise<Login> {
    const salt = await bcrypt.genSalt();

    const emailExists = await this.prismaService.login.findFirst({
      where: { username: data.username },
      select: { username: true }
    })

    if (emailExists) {
      throw new UserInputError('El usuario ya se encuentra registrado');
    }

    const user = this.prismaService.login.create({
      data: {
        username: data.username,
        password: await this.hashPassword(data.password, salt),
        salt: salt,
        token: data.token,
        role_id: data.role_id
      }
    })

    if (!user) {
      throw new UserInputError('El usuario no existe');
    }

    return user;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async createToken(token: string, user) {
    const updToken = await this.prismaService.login.update({
      where: { id: user.id, },
      data: { token: token, },
      select: { token: true, id: true, active_two_factor: true }
    })

    return updToken;
  }
}
