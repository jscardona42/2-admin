import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
const fetch = require('node-fetch');
import { Response } from 'express';
import { configTwoFactorInput, RecoveryCodeInput, Twofactor, TwoFactorAuthenticateInput, ValidateCodeInput } from '../twofactor/twofactor.entity';
import { TwofactorService } from '../twofactor/twofactor.service';
import { LoginService } from '../users/login.service';
import { Login } from '../users/login.entity';
var QRCode = require('qrcode')

@Resolver(() => Twofactor)
export class TwofactorResolver {

    constructor(
        private readonly loginService: LoginService,
        private readonly twofactorService: TwofactorService
    ) { }

    @Mutation(returns => Twofactor)
    @UsePipes(ValidationPipe)
    async createTwoFactor(
        @Args("data") data: configTwoFactorInput,
        @Context() ctx): Promise<Twofactor> {
        return this.twofactorService.createTwoFactor(data);
    }

    @Query(returns => Twofactor)
    @UsePipes(ValidationPipe)
    async getTwoFactorById(
        @Args("twofactor_id") twofactor_id: number,
        @Context() ctx): Promise<Twofactor> {
        return this.twofactorService.getTwoFactorById(twofactor_id);
    }

    @Query(returns => Twofactor)//Válido para 2FA
    @UsePipes(ValidationPipe)
    async configTwoFactor(
        @Args("login_id") login_id: number, @Context('res') res: Response): Promise<Object> {

        var twofactorReturn = {};
        var login = await this.loginService.getLoginById(login_id);
        if (!login.active_two_factor) {
            throw new UnauthorizedException("Debe activar la autenticación de dos factores para el usuario");
        }
        var twofactor = await this.twofactorService.getTwoFactorByLoginId(login_id);
        var user = await this.loginService.getUserById(login.user_id);

        if (!twofactor.config_twofactor) {
            const { otpauthUrl, secret } = await this.twofactorService.generateTwoFactorAuthenticationSecret(user);
            const qrCodeUrl = await this.twofactorService.buildQrCodeUrl(otpauthUrl);
            twofactorReturn = await this.twofactorService.configTwoFactor(secret, login_id, qrCodeUrl);
            return Object.assign(twofactorReturn, { qr_code: JSON.stringify(qrCodeUrl) });
        }

        twofactorReturn = await this.twofactorService.getTwoFactorById(twofactor.twofactor_id);
        return Object.assign(twofactorReturn, { qr_code: "" });
    }

    @Query(returns => Login)//Válido para 2FA
    @UsePipes(ValidationPipe)
    async validateTwoFactorCode(
        @Args("data") data: TwoFactorAuthenticateInput, @Context('res') res: Response): Promise<Login> {

        const login = await this.loginService.getLoginById(data.login_id);
        const twofactor = await this.twofactorService.getTwoFactorByLoginId(data.login_id);

        const isCodeValid = this.twofactorService.validateTwoFactorCode(
            data, twofactor
        );

        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        return login;
    }

    @Mutation(returns => Twofactor)//Válido para 2FA // Recovery-Codes
    @UsePipes(ValidationPipe)
    async setActivateConfigTwofactorTOTP(
        @Args("login_id") login_id: number,
        @Context() ctx): Promise<Twofactor> {
        var twofactor = await this.twofactorService.getTwoFactorByLoginId(login_id);
        if (!twofactor.config_twofactor) {
            return this.twofactorService.setActivateConfigTwofactorTOTP(twofactor);
        }
        return twofactor;
    }

    @Query(returns => Twofactor)
    @UsePipes(ValidationPipe)
    async validateRecoveryCode(
        @Args("data") data: RecoveryCodeInput,
        @Context() ctx): Promise<Twofactor> {
        return this.twofactorService.validateRecoveryCode(data);
    }

    @Mutation(returns => Twofactor)//Email
    @UsePipes(ValidationPipe)
    async sendMail(
        @Args("login_id") login_id: number,
        @Context() ctx): Promise<Twofactor> {
        try {
            var login = await this.loginService.getLoginById(login_id);
            var twofactor = await this.twofactorService.getTwoFactorByLoginId(login_id);
            var user = await this.loginService.getUserById(login.user_id);
            var data = await this.twofactorService.sendCodeMail(user, twofactor, login);
            return data;
        } catch (error) {
            throw new UnauthorizedException("No se pudo enviar el código de verificación" + error);
        }
    }

    @Query(returns => Twofactor)
    @UsePipes(ValidationPipe)
    async validationCodeMail(
        @Args("data") data: ValidateCodeInput,
        @Context() ctx): Promise<Twofactor> {
        var login = await this.loginService.getLoginById(data.login_id);
        var twofactor = await this.twofactorService.getTwoFactorByLoginId(data.login_id);
        return this.twofactorService.validationCodeMail(data, login, twofactor);
    }

}
