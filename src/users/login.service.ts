import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { Login } from './login.entity';
import { TwoFactorAuthenticationService } from 'src/twofactor/twoFactorAuthentication.service';
import { json } from 'express';
var QRCode = require('qrcode')


@Injectable()
export class LoginService {
  constructor(private prismaService: PrismaService, private jwtService: JwtService) { }

  async getLogin() {
    return this.prismaService.login.findMany();
  }

  async getLoginById(data: any): Promise<Login> {
    return await this.prismaService.login.findUnique({
      where: { id: parseInt(data.login_id) }
    });
  }

  async getUserById(id: number) {
    return await this.prismaService.users.findUnique({
      where: { id: id }
    });
  }

  async signInLogin(data, res) {

    const salt = await this.prismaService.login.findFirst({
      where: { username: data.username },
      select: { salt: true },
    })

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
      throw new AuthenticationError('Invalid credentials');
    }

    const token = this.jwtService.sign({ userId: user.id });
    const updToken = this.createToken(token, user, res);

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
        role_id: 3
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

  async createToken(token: string, user, res) {
    const updToken = await this.prismaService.login.update({
      where: { id: user.id, },
      data: { token: token, },
      select: { token: true, id: true, active_two_factor: true }
    })

    return updToken;
  }

  async setTwoFactorSecret(secret: string, data: any, qrCodeUrl) {
    var twofactor = await this.prismaService.twofactor.findFirst({
      where: { login_id: parseInt(data.login_id) },
      select: { twofactor_id: true }
    })

    if (twofactor) {
      return await this.prismaService.twofactor.update({
        where: { twofactor_id: twofactor.twofactor_id },
        data: { twofactor_secret: secret, qr_code: JSON.stringify(qrCodeUrl) },
        select: {
          twofactor_secret: true,
          qr_code: true,
          twofactor_id: true,
          config_twofactor: true,
          login_id: true,
          Login: { select: { token: true, user_id: true, active_two_factor: true } }
        }
      })
    } else {
      return await this.prismaService.twofactor.create({
        data: { twofactor_secret: secret, qr_code: JSON.stringify(qrCodeUrl), login_id: parseInt(data.login_id) },
        select: {
          twofactor_secret: true,
          twofactor_id: true,
          qr_code: true,
          config_twofactor: true,
          login_id: true,
          Login: { select: { token: true, user_id: true, active_two_factor: true } }
        }
      })
    }
  }

  async buildQrCodeUrl(str) {
    return new Promise(function (resolve, reject) {
      QRCode.toDataURL(str, function (err, url) {
        if (err) {
          throw new AuthenticationError("No se pudo construir el qr");
          reject(err);
          return;
        }
        resolve(url);
      });
    });
  }

  async setTwoFactorConfig(data) {
    var min = 0;
    var max = 9999999999;
    var recoveryCodes = [];

    for (let index = 0; index < 10; index++) {
      recoveryCodes[index] = this.generateRecoveryCodes(min, max).padStart(6, 0)
    }

    return await this.prismaService.twofactor.update({
      where: { twofactor_id: parseInt(data.twofactor_id) },
      data: { config_twofactor: 1, recovery_codes: JSON.stringify(recoveryCodes) }
    })
  }

  async getTwoFactorByLoginId(data) {
    return await this.prismaService.twofactor.findFirst({
      where: { login_id: parseInt(data.login_id) },
      select: { config_twofactor: true, twofactor_id: true, twofactor_secret: true, login_id: true, recovery_codes: true }
    })
  }

  async getTwoFactorById(twofactor_id) {
    return await this.prismaService.twofactor.findUnique({
      where: { twofactor_id: twofactor_id },
      select: {
        twofactor_secret: true,
        twofactor_id: true,
        qr_code: true,
        config_twofactor: true,
        login_id: true,
        recovery_codes: true,
        Login: { select: { token: true, user_id: true, active_two_factor: true } }
      }
    })
  }

  async validateRecoveryCode(data) {
    var twofactor = await this.prismaService.twofactor.findFirst({
      where: { twofactor_id: data.twofactor_id }
    })

    var contador = 0;
    var recoveryCodes = JSON.parse(twofactor.recovery_codes)
    recoveryCodes.forEach(function (code, index) {
      if (code == data.recovery_code) {
        contador = contador + 1;
      }
    });
    
    if (contador > 0) {
      return twofactor;
    } else {
      throw new UnauthorizedException("Código de recuperación erroneo");
    }
  }

  generateRecoveryCodes(min, max) {
    var recoveryCode = Math.floor(Math.random() * (max - min)) + min;
    return recoveryCode.toString();
  }

}
