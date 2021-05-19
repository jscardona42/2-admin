import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { authenticator } from 'otplib';
import { AuthenticationError } from 'apollo-server-express';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from "bcrypt";
import { configTwoFactorInput, RecoveryCodeInput, Twofactor, TwoFactorAuthenticateInput } from './twofactor.entity';
var QRCode = require('qrcode')


@Injectable()
export class TwofactorService {
    constructor(private prismaService: PrismaService, private readonly mailerService: MailerService) { }

    public async generateTwoFactorAuthenticationSecret(user) {
        authenticator.options = { window: 0 };
        const secret = authenticator.generateSecret();
        const otpauthUrl = authenticator.keyuri(user.email, "Maia ERP", secret);
        return { secret, otpauthUrl }
    }

    public validateTwoFactorCode(data: TwoFactorAuthenticateInput, twofactor: Twofactor) {
        return authenticator.verify({
            token: data.code,
            secret: twofactor.twofactor_secret
        })
    }

    async createTwoFactor(data: configTwoFactorInput): Promise<Twofactor> {
        var twofactor = await this.prismaService.twofactor.findFirst({
            where: { login_id: data.login_id }
        })

        if (twofactor) {
            return await this.prismaService.twofactor.update({
                where: { twofactor_id: twofactor.twofactor_id },
                data: { validation_method_id: data.validation_method_id },
            })
        }
        return await this.prismaService.twofactor.create({
            data: { login_id: data.login_id, validation_method_id: data.validation_method_id },
        })
    }

    async configTwoFactor(secret: string, login_id: number): Promise<Twofactor> {
        var twofactor = await this.prismaService.twofactor.findFirst({
            where: { login_id: login_id },
            select: { twofactor_id: true }
        })

        if (twofactor === null) {
            throw new UnauthorizedException("User does not have two-factor authentication enabled.");
        }

        return await this.prismaService.twofactor.update({
            where: { twofactor_id: twofactor.twofactor_id },
            data: { twofactor_secret: secret }
        })
    }

    async setActivateConfigTwofactorTOTP(twofactor: Twofactor): Promise<Twofactor> {
        try {
            var recoveryCode = this.generateRecoveryCode(20);

            return await this.prismaService.twofactor.update({
                where: { twofactor_id: twofactor.twofactor_id },
                data: { config_twofactor: 1, recovery_code: recoveryCode }
            })
        } catch (error) {
            throw new UnauthorizedException("Unable to generate recovery codes");
        }
    }

    async getTwoFactorByLoginId(login_id: number): Promise<Twofactor> {
        return await this.prismaService.twofactor.findFirst({
            where: { login_id: login_id }
        })
    }

    async getTwoFactorById(twofactor_id): Promise<Twofactor> {
        return await this.prismaService.twofactor.findUnique({
            where: { twofactor_id: twofactor_id }
        })
    }

    async validateRecoveryCode(data: RecoveryCodeInput): Promise<Twofactor> {
        var twofactor = await this.prismaService.twofactor.findFirst({
            where: { twofactor_id: data.twofactor_id, recovery_code: data.recovery_code }
        })

        if (twofactor !== null) {
            return twofactor;
        } else {
            throw new UnauthorizedException("Invalid recovery code");
        }
    }

    public async sendCodeMail(user, twofactor: Twofactor, login: any) {
        if (twofactor.validation_method_id !== 2) {
            throw new UnauthorizedException("User does not have the dual factor function enabled.");
        }
        var recoveryCode = this.generateCodeAuthentication().padStart(8, "0");
        var hashRecoveryCode = bcrypt.hash(recoveryCode, login.salt);

        var data = await this.prismaService.twofactor.update({
            where: { twofactor_id: twofactor.twofactor_id },
            data: { recovery_code: await hashRecoveryCode, time_creation_code: new Date() }
        });

        try {
            await this.mailerService.sendMail({
                to: user.email,
                from: "tiresiatest@gmail.com",
                subject: 'Código de verificación',
                text: 'Código de verificación',
                html: `<b>Su código de verificación es ${recoveryCode} </b>`,
            })
        } catch (error) {
            throw new UnauthorizedException("Unable to send verification code " + error);
        }
        return data;
    }

    public async validationCodeMail(data, login, twofactor): Promise<Twofactor> {

        let date1 = new Date(twofactor.time_creation_code);
        let date2 = new Date();

        let time = date2.getTime() - date1.getTime();
        var minutes = Math.round(time / (1000 * 60));

        if (minutes > 15) {
            throw new UnauthorizedException("Validation code expired");
        }

        var twofactorRtn = await this.prismaService.twofactor.findFirst({
            where: {
                login_id: data.login_id,
                recovery_code: await bcrypt.hash(data.validate_code, login.salt)
            },
        })
        if (twofactorRtn === null) {
            throw new UnauthorizedException("Incorrect validation code");
        }
        return twofactorRtn;
    }

    async buildQrCodeUrl(str): Promise<Object> {
        return new Promise(function (resolve, reject) {
            QRCode.toDataURL(str, function (err, url) {
                if (err) {
                    throw new AuthenticationError("Could not build the qr");
                    reject(err);
                    return;
                }
                resolve(url);
            });
        });
    }

    async sendQrCodeTOTP(twofactor, login, user, recoveryCodes) {
        try {
            var codes = JSON.stringify(recoveryCodes);
            codes = codes.split('"').join('');
            codes = codes.split('[').join('');
            codes = codes.split(']').join('');

            return await this.mailerService.sendMail({
                to: user.email,
                from: "tiresiatest@gmail.com",
                subject: 'Verification code',
                text: 'welcome',
                html: `<h2>Escanee el código QR con una aplicación de autenticación de dos factores</h2>
                        <div><img src="cid:code_qr"/></div>
                        <h2>Códigos de recuperación: <br></h2>
                        <h3>${codes.split(',').join('<br>')}</h3>`,
                attachments: [{
                    filename: 'qrcode.png',
                    path: `${JSON.parse(twofactor.qr_code)}`,
                    cid: 'code_qr' // should be as unique as possible
                }]
            })
        } catch (error) {
            throw new UnauthorizedException("Unable to send verification code " + error);
        }
    }

    generateCodeAuthentication(): string {
        var min = 0;
        var max = 9999999999;
        var recoveryCode = Math.floor(Math.random() * (max - min)) + min;
        return recoveryCode.toString();
    }

    generateRecoveryCode(max): string {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < max; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

}