import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';

import { UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
const fetch = require('node-fetch');
import { Response } from 'express';
import { TwoFactorAuthenticationService } from 'src/twofactor/twoFactorAuthentication.service';
import { configTwoFactorInput, RecoveryCodeInput, Twofactor, TwoFactorAuthenticateInput, ValidateCodeInput } from 'src/twofactor/twofactor.entity';
import { TwofactorService } from 'src/twofactor/twofactor.service';
import { LoginService } from 'src/users/login.service';
import { Login } from 'src/users/login.entity';
var QRCode = require('qrcode')

@Resolver(() => Twofactor)
export class TwofactorResolver {

    constructor(
        private readonly loginService: LoginService,
        private readonly twoFactorService: TwoFactorAuthenticationService,
        private readonly twofactorService: TwofactorService
    ) { }

    @Mutation(returns => Twofactor)
    @UsePipes(ValidationPipe)
    async createTwoFactor(
        @Args("data") data: configTwoFactorInput,
        @Context() ctx) {
        return this.twofactorService.createTwoFactor(data);
    }

    @Query(returns => Twofactor)
    @UsePipes(ValidationPipe)
    async getTwoFactorById(
        @Args("twofactor_id") twofactor_id: number,
        @Context() ctx) {
        return this.twofactorService.getTwoFactorById(twofactor_id);
    }

    @Query(returns => Twofactor)//Válido para 2FA
    @UsePipes(ValidationPipe)
    async configTwoFactor(
        @Args("login_id") login_id: number, @Context('res') res: Response) {

        var login = await this.loginService.getLoginById(login_id);
        var twofactor = await this.twofactorService.getTwoFactorByLoginId(login_id);
        var user = await this.loginService.getUserById(login.user_id);

        if (twofactor.validation_method_id == 1) {
            if (!twofactor.config_twofactor) {
                const { otpauthUrl, secret } = await this.twoFactorService.generateTwoFactorAuthenticationSecret(user);
                const qrCodeUrl = await this.twofactorService.buildQrCodeUrl(otpauthUrl);
                return await this.twofactorService.setTwoFactorSecret(secret, login_id, qrCodeUrl);
            }
        }
        return await this.twofactorService.getTwoFactorById(twofactor.twofactor_id);
    }

    @Query(returns => Login)//Válido para 2FA
    @UsePipes(ValidationPipe)
    async validateTwoFactorCode(
        @Args("data") data: TwoFactorAuthenticateInput, @Context('res') res: Response) {

        const login = await this.loginService.getLoginById(data.login_id);
        const twofactor = await this.twofactorService.getTwoFactorByLoginId(data.login_id);

        const isCodeValid = this.twoFactorService.validateTwoFactorCode(
            data, twofactor
        );

        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        return login;
    }

    @Mutation(returns => Twofactor)//Válido para 2FA // Recovery-Codes
    @UsePipes(ValidationPipe)
    async setTwoFactorConfig(
        @Args("twofactor_id") twofactor_id: number,
        @Context() ctx) {
        var twofactor = await this.twofactorService.getTwoFactorById(twofactor_id);
        return this.twofactorService.setTwoFactorConfig(twofactor);
    }

    @Query(returns => Twofactor)
    @UsePipes(ValidationPipe)
    async validateRecoveryCode(
        @Args("data") data: RecoveryCodeInput,
        @Context() ctx) {
        return this.twofactorService.validateRecoveryCode(data);
    }

    @Mutation(returns => Twofactor)//Email
    @UsePipes(ValidationPipe)
    async sendMail(
        @Args("login_id") login_id: number,
        @Context() ctx) {
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
        @Context() ctx) {
        var login = await this.loginService.getLoginById(data.login_id);
        return this.twofactorService.validationCodeMail(data, login);
    }

}
