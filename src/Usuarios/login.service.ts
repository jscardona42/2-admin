import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { Login } from './entities/login.entity';
import { AuditoriasService } from 'src/Auditorias/auditorias.service';
import { Usuarios } from './entities/usuarios.entity';


@Injectable()
export class LoginService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private auditService: AuditoriasService
  ) { }

  async getLogin(): Promise<Login[]> {
    return this.prismaService.login.findMany();
  }

  async getLoginById(login_id: number): Promise<Login> {
    return await this.prismaService.login.findUnique({
      where: { login_id: login_id },
      include: {
        Usuarios: true,
      }
    });
  }

  async getUsuarioById(id: number): Promise<Usuarios> {
    return await this.prismaService.usuarios.findUnique({
      where: { usuario_id: id }
    });
  }

  async signInLogin(data: any): Promise<Login> {
    const salt = await this.prismaService.login.findFirst({
      where: { username: data.username },
      select: { salt: true },
    })

    if (salt === null) {
      this.auditService.registerAuditoria(data);
      throw new AuthenticationError('Invalid credentials');
    }

    const user = await this.prismaService.login.findFirst({
      where: {
        username: data.username,
        password: await this.hashPassword(data.password, salt.salt)
      },
    })

    if (!user) {
      this.auditService.registerAuditoria(data);
      throw new AuthenticationError('Invalid credentials');
    }

    this.auditService.registerAuditoria(user);

    const token = this.jwtService.sign({ userId: user.usuario_id });
    const updToken = this.createToken(token, user);

    return updToken;
  }

  async signUpLogin(data): Promise<any> {
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
        rol_id: data.role_id
      }
    })

    if (user === null) {
      throw new UnauthorizedException('User does not exist');
    }

    return user;
  }

  async logOutLogin(login_id) {
    return await this.prismaService.login.update({
      where: { login_id: login_id },
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

  async createToken(token: string, user): Promise<any> {
    const updToken = await this.prismaService.login.update({
      where: { login_id: user.login_id, },
      data: { token: token, },
      include: {
        Usuarios: true,
        DoblesFactores: true
      }
    })

    return updToken;
  }
}