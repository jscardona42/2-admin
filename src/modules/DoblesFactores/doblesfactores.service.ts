import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { authenticator } from 'otplib';
import { AuthenticationError } from 'apollo-server-express';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from "bcryptjs";
import { DoblesFactores } from './entities/doblesfactores.entity';
import { CodigoRecuperacionInput, configDoblesFactoresInput, DoblesFactoresValidarInput } from './dto/doblesfactores.dto';
import { LoginService } from '../Login/login.service';
import { MetodosValidacionService } from '../Admin/MetodosValidacion/metodosvalidacion.service';
var QRCode = require('qrcode')


@Injectable()
export class DoblesFactoresService {
    constructor(
        private prismaService: PrismaService, 
        private readonly mailerService: MailerService,
        private readonly loginService: LoginService,
        private readonly metValService: MetodosValidacionService
        ) { }

    public async generateDobleFactorAuthenticationSecret(user) {
        authenticator.options = { window: 0 };
        const secret = authenticator.generateSecret();
        const otpauthUrl = authenticator.keyuri(user.email, "Maia ERP", secret);
        return { secret, otpauthUrl }
    }

    public exValidateDobleFactorCode(data: DoblesFactoresValidarInput, doblefactor: DoblesFactores) {
        return authenticator.verify({
            token: data.codigo,
            secret: doblefactor.otplib_secreta
        })
    }

    async createDobleFactor(data: configDoblesFactoresInput): Promise<DoblesFactores> {

        await this.metValService.getMetodoValidacionById(data.metodo_validacion_id);
        await this.loginService.getLoginById(data.login_id);

        var doblefactor = await this.prismaService.doblesFactores.findFirst({
            where: { login_id: data.login_id }
        })

        if (doblefactor) {
            return await this.prismaService.doblesFactores.update({
                where: { doble_factor_id: doblefactor.doble_factor_id },
                data: { metodo_validacion_id: data.metodo_validacion_id },
            })
        }
        return await this.prismaService.doblesFactores.create({
            data: { login_id: data.login_id, metodo_validacion_id: data.metodo_validacion_id },
        })
    }

    async configDobleFactor(secret: string, login_id: number): Promise<DoblesFactores> {
        var doblefactor = await this.prismaService.doblesFactores.findFirst({
            where: { login_id: login_id },
            select: { doble_factor_id: true }
        })

        if (doblefactor === null) {
            throw new UnauthorizedException("User does not have two-factor authentication enabled.");
        }

        return await this.prismaService.doblesFactores.update({
            where: { doble_factor_id: doblefactor.doble_factor_id },
            data: { otplib_secreta: secret }
        })
    }

    async exSetActivateConfigTwofactorTOTP(doblefactor: DoblesFactores): Promise<DoblesFactores> {
        try {
            var recoveryCode = this.generateRecoveryCode(20);

            return await this.prismaService.doblesFactores.update({
                where: { doble_factor_id: doblefactor.doble_factor_id },
                data: { esta_configurado: true, codigo_recuperacion: recoveryCode }
            })
        } catch (error) {
            throw new UnauthorizedException("Unable to generate recovery codes");
        }
    }

    async getDobleFactorByLoginId(login_id: number): Promise<DoblesFactores> {
        return await this.prismaService.doblesFactores.findFirst({
            where: { login_id: login_id }
        })
    }

    async getDobleFactorById(doblefactor_id: number): Promise<DoblesFactores> {
        var doblesFactores = await this.prismaService.doblesFactores.findUnique({
            where: { doble_factor_id: doblefactor_id }
        })

        if (doblesFactores === null) {
            throw new UnauthorizedException(`El doble factor con id ${doblefactor_id} no existe`);
        }

        return doblesFactores;
    }

    async exValidateRecoveryCode(data: CodigoRecuperacionInput): Promise<DoblesFactores> {
        var doblefactor = await this.prismaService.doblesFactores.findFirst({
            where: { login_id: data.login_id, codigo_recuperacion: data.codigo_recuperacion }
        })

        if (doblefactor) {
            await this.prismaService.doblesFactores.update({
                where: { doble_factor_id: doblefactor.doble_factor_id },
                data: { esta_configurado: false }
            })
        }

        if (doblefactor !== null) {
            return doblefactor;
        } else {
            throw new UnauthorizedException("Invalid recovery code");
        }
    }

    public async sendCodeMail(usuario, doblefactor: DoblesFactores, login: any) {
        if (doblefactor.metodo_validacion_id !== 2) {
            throw new UnauthorizedException("User does not have the dual factor function enabled.");
        }
        var recoveryCode = this.generateCodeAuthentication().padStart(8, "0");
        var hashRecoveryCode = bcrypt.hash(recoveryCode, login.salt);

        var data = await this.prismaService.doblesFactores.update({
            where: { doble_factor_id: doblefactor.doble_factor_id },
            data: { codigo_recuperacion: await hashRecoveryCode, fecha_creacion_codigo: new Date() }
        });

        try {
            await this.mailerService.sendMail({
                to: usuario.email,
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

    public async validationCodeMail(data, login, doblefactor): Promise<DoblesFactores> {

        let date1 = new Date(doblefactor.fecha_creacion_codigo);
        let date2 = new Date();

        let time = date2.getTime() - date1.getTime();
        var minutes = Math.round(time / (1000 * 60));

        if (minutes > 15) {
            throw new UnauthorizedException("Validation code expired");
        }

        var twofactorRtn = await this.prismaService.doblesFactores.findFirst({
            where: {
                login_id: data.login_id,
                codigo_recuperacion: await bcrypt.hash(data.codigo_validacion, login.salt)
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

    async sendQrCodeTOTP(doblefactor, login, usuario, recoveryCodes) {
        try {
            var codes = JSON.stringify(recoveryCodes);
            codes = codes.split('"').join('');
            codes = codes.split('[').join('');
            codes = codes.split(']').join('');

            return await this.mailerService.sendMail({
                to: usuario.email,
                from: "tiresiatest@gmail.com",
                subject: 'Verification code',
                text: 'welcome',
                html: `<h2>Escanee el código QR con una aplicación de autenticación de dos factores</h2>
                        <div><img ..="cid:code_qr"/></div>
                        <h2>Códigos de recuperación: <br></h2>
                        <h3>${codes.split(',').join('<br>')}</h3>`,
                attachments: [{
                    filename: 'qrcode.png',
                    path: `${JSON.parse(doblefactor.qr_code)}`,
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