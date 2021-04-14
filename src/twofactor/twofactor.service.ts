import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from "@nestjs/jwt";
import { AuthenticationError } from 'apollo-server-express';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from "bcrypt";
var QRCode = require('qrcode')


@Injectable()
export class TwofactorService {
    constructor(private prismaService: PrismaService, private jwtService: JwtService, private readonly mailerService: MailerService) { }

    async createTwoFactor(data: any) {
        return await this.prismaService.twofactor.create({
            data: { login_id: data.login_id, validation_method_id: data.validation_method_id },
        })
    }

    async setTwoFactorSecret(secret: string, login_id: number, qrCodeUrl) {
        var twofactor = await this.prismaService.twofactor.findFirst({
            where: { login_id: login_id },
            select: { twofactor_id: true }
        })

        if (twofactor) {
            return await this.prismaService.twofactor.update({
                where: { twofactor_id: twofactor.twofactor_id },
                data: { twofactor_secret: secret, qr_code: JSON.stringify(qrCodeUrl) }
            })
        } else {
            return await this.prismaService.twofactor.create({
                data: { twofactor_secret: secret, qr_code: JSON.stringify(qrCodeUrl), login_id: login_id },
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

    async setTwoFactorConfig(twofactor) {
        var min = 0;
        var max = 9999999999;
        var recoveryCodes = [];

        for (let index = 0; index < 10; index++) {
            recoveryCodes[index] = this.generateRecoveryCodes(min, max).padStart(10, 0)
        }

        return await this.prismaService.twofactor.update({
            where: { twofactor_id: parseInt(twofactor.twofactor_id) },
            data: { config_twofactor: 1, recovery_codes: JSON.stringify(recoveryCodes) }
        })
    }

    async getTwoFactorByLoginId(login_id: number) {
        return await this.prismaService.twofactor.findFirst({
            where: { login_id: login_id }
        })
    }

    async getTwoFactorById(twofactor_id) {
        return await this.prismaService.twofactor.findUnique({
            where: { twofactor_id: twofactor_id }
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
            throw new UnauthorizedException("Código de recuperación inválido");
        }
    }

    generateRecoveryCodes(min, max) {
        var recoveryCode = Math.floor(Math.random() * (max - min)) + min;
        return recoveryCode.toString();
    }

    public async sendCodeMail(user, twofactor, login) {
        var min = 0;
        var max = 99999999;

        var recoveryCode = this.generateRecoveryCodes(min, max).padStart(8, 0);
        var hashRecoveryCode = bcrypt.hash(recoveryCode, login.salt);

        var data = await this.prismaService.twofactor.update({
            where: { twofactor_id: twofactor.twofactor_id },
            data: { recovery_codes: await hashRecoveryCode }
        })

        try {
            await this.mailerService.sendMail({
                to: user.email,
                from: "tiresiatest@gmail.com",
                subject: 'Verification code',
                text: 'welcome',
                html: `<b>Su código de verificación es ${recoveryCode} </b>`,
            })
        } catch (error) {
            throw new UnauthorizedException("No se pudo enviar el código de verificación" + error);
        }
        return data;
    }

    public async validationCodeMail(data, login) {
        var twofactor = await this.prismaService.twofactor.findFirst({
            where: {
                login_id: data.login_id,
                recovery_codes: await bcrypt.hash(data.validate_code, login.salt)
            },
        })
        if (twofactor === null) {
            throw new UnauthorizedException("El código de validación no coincide");
        }
        return twofactor;

    }

}