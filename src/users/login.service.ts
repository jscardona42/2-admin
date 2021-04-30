import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { Login } from './login.entity';
import { AuditService } from '../audit/audit.service';
import { Users } from '.prisma/client';
var QRCode = require('qrcode')


@Injectable()
export class LoginService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private auditService: AuditService
  ) { }

  async getLogin(): Promise<Login[]> {
    return this.prismaService.login.findMany();
  }

  async getLoginById(login_id: number): Promise<Login> {
    return await this.prismaService.login.findUnique({
      where: { id: login_id }
    });
  }

  async getUserById(id: number): Promise<Users> {
    return await this.prismaService.users.findUnique({
      where: { id: id }
    });
  }

  async signInLogin(data: any): Promise<Login> {
    const salt = await this.prismaService.login.findFirst({
      where: { username: data.username },
      select: { salt: true },
    })

    if (salt === null) {
      this.auditService.registerAudit(data);
      throw new AuthenticationError('Invalid credentials');
    }

    const user = await this.prismaService.login.findFirst({
      where: {
        username: data.username,
        password: await this.hashPassword(data.password, salt.salt)
      },
    })

    if (!user) {
      this.auditService.registerAudit(data);
      throw new AuthenticationError('Invalid credentials');
    }

    this.auditService.registerAudit(user);

    const token = this.jwtService.sign({ userId: user.id });
    const updToken = this.createToken(token, user);

    return updToken;
  }

  async signUpLogin(data): Promise<Login> {
    const salt = await bcrypt.genSalt();

    const usernameExists = await this.usernameExists(data.username);

    if (usernameExists) {
      throw new UnauthorizedException('The user is already registered');
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

    if (user === null) {
      throw new UnauthorizedException('User does not exist');
    }

    return user;
  }

  async logOutLogin(login_id) {
    return await this.prismaService.login.update({
      where: { id: login_id },
      data: { token: null }
    })
  }

  async usernameExists(username) {
    const user = await this.prismaService.login.findMany({
      where: { username: username },
      select: { username: true }
    })

    if (user === null) {
      return false;
    } else {
      return true;
    }
  }
  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async createToken(token: string, user): Promise<Login> {
    const updToken = await this.prismaService.login.update({
      where: { id: user.id, },
      data: { token: token, },
    })

    return updToken;
  }
}