import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { AuthenticationError } from 'apollo-server-express';
import { Login } from './entities/login.entity';
import { AuditoriasService } from '../Auditorias/auditorias.service';
import { Usuarios } from '../Usuarios/entities/usuarios.entity';
import { RolesService } from '../Admin/Roles/roles.service';
import { SignUpUserInput } from './dto/login.dto';


@Injectable()
export class LoginService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private auditService: AuditoriasService,
    private rolesService: RolesService
  ) { }

  async getLogin(): Promise<Login[]> {
    return this.prismaService.login.findMany();
  }

  async getLoginById(login_id: number): Promise<Login> {
    var login = await this.prismaService.login.findUnique({
      where: { login_id: login_id },
      include: {
        Usuarios: true,
      }
    });

    if (login === null) {
      throw new UnauthorizedException(`El login con id ${login_id} no existe`);
    }

    return login;
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
      throw new AuthenticationError('Credenciales inválidas');
    }

    const user = await this.prismaService.login.findFirst({
      where: {
        username: data.username,
        password: await this.hashPassword(data.password, salt.salt)
      },
    })

    if (!user) {
      this.auditService.registerAuditoria(data);
      throw new AuthenticationError('Credenciales inválidas');
    }

    this.auditService.registerAuditoria(user);

    const token = this.jwtService.sign({ userId: user.usuario_id });
    const updToken = this.createToken(token, user);

    return updToken;
  }

  async signUpLogin(data: SignUpUserInput): Promise<any> {

    await this.rolesService.getRolById(data.rol_id);

    const salt = await bcrypt.genSalt();

    const usernameExists = await this.usernameExists(data.username);

    if (usernameExists) {
      throw new UnauthorizedException('El usuario ya se encuentra registrado');
    }

    const user = this.prismaService.login.create({
      data: {
        username: data.username,
        password: await this.hashPassword(data.password, salt),
        salt: salt,
        rol_id: data.rol_id
      }
    })

    if (user === null) {
      throw new UnauthorizedException('El usuario no pudo ser creado');
    }

    return user;
  }

  async logOutLogin(login_id) {
    return await this.prismaService.login.update({
      where: { login_id: login_id },
      data: { token: null }
    })
  }

  async exChangePasswordLogin(data): Promise<any> {

    await this.getLoginById(data.login_id);

    const salt = await this.prismaService.login.findFirst({
      where: { login_id: data.login_id },
      select: { salt: true },
    })

    if (salt === null) {
      throw new AuthenticationError('Invalid credentials');
    }

    const login = await this.prismaService.login.findFirst({
      where: {
        password: await this.hashPassword(data.password, salt.salt)
      },
    })

    if (login === null) {
      throw new AuthenticationError('Invalid credentials');
    }

    const new_salt = await bcrypt.genSalt();

    const user = await this.prismaService.login.update({
      where: { login_id: data.login_id },
      data: {
        password: await this.hashPassword(data.new_password, new_salt),
        salt: new_salt,
      }
    })

    if (user === null) {
      throw new UnauthorizedException('User does not exist');
    }

    return user;
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