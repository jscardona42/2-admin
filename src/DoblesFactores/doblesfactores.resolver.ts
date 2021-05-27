import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
const fetch = require('node-fetch');
import { DoblesFactores} from './entities/doblesfactores.entity';
import { CodigoRecuperacionInput, configDoblesFactoresInput, DoblesFactoresValidarInput, ValidarCodigoInput } from './dto/doblesfactores.dto';
import { LoginService } from 'src/Usuarios/login.service';
import { DoblesFactoresService } from './doblesfactores.service';
import { Login } from 'src/Usuarios/entities/login.entity';

var QRCode = require('qrcode')

@Resolver(() => DoblesFactores)
export class DoblesFactoresResolver {

    constructor(
        private readonly loginService: LoginService,
        private readonly doblesFactoresService: DoblesFactoresService
    ) { }

    @Mutation(returns => DoblesFactores)
    @UsePipes(ValidationPipe)
    async createDoblesFactores(
        @Args("data") data: configDoblesFactoresInput): Promise<DoblesFactores> {
        return this.doblesFactoresService.createDoblesFactores(data);
    }

    @Query(returns => DoblesFactores)
    @UsePipes(ValidationPipe)
    async getDobleFactorById(
        @Args("doblefactor_id") doblefactor_id: number): Promise<DoblesFactores> {
        return this.doblesFactoresService.getDobleFactorById(doblefactor_id);
    }

    @Query(returns => DoblesFactores)
    @UsePipes(ValidationPipe)
    async getDobleFactorByLoginId(
        @Args("login_id") login_id: number): Promise<DoblesFactores> {
        return this.doblesFactoresService.getDobleFactorByLoginId(login_id);
    }

    @Query(returns => DoblesFactores)//Válido para 2FA
    @UsePipes(ValidationPipe)
    async configDobleFactor(
        @Args("login_id") login_id: number): Promise<Object> {

        var twofactorReturn = {};
        var login = await this.loginService.getLoginById(login_id);
        if (!login.tiene_doble_factor) {
            throw new UnauthorizedException("You must enable two-factor authentication for the user.");
        }
        var doblefactor = await this.doblesFactoresService.getDobleFactorByLoginId(login_id);
        var user = await this.loginService.getUsuarioById(login.usuario_id);

        if (!doblefactor.esta_configurado) {
            const { otpauthUrl, secret } = await this.doblesFactoresService.generateDobleFactorAuthenticationSecret(user);
            const qrCodeUrl = await this.doblesFactoresService.buildQrCodeUrl(otpauthUrl);
            twofactorReturn = await this.doblesFactoresService.configTwoFactor(secret, login_id);
            return Object.assign(twofactorReturn, { qr_code: JSON.stringify(qrCodeUrl) });
        }

        twofactorReturn = await this.doblesFactoresService.getDobleFactorById(doblefactor.doble_factor_id);
        return Object.assign(twofactorReturn, { qr_code: "" });
    }

    @Query(returns => Login)//Válido para 2FA
    @UsePipes(ValidationPipe)
    async exValidateDobleFactorCode(
        @Args("data") data: DoblesFactoresValidarInput): Promise<Login> {

        const login = await this.loginService.getLoginById(data.login_id);
        const doblefactor = await this.doblesFactoresService.getDobleFactorByLoginId(data.login_id);

        const isCodeValid = this.doblesFactoresService.exValidateDobleFactorCode(
            data, doblefactor
        );

        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        return login;
    }

    @Mutation(returns => DoblesFactores)//Válido para 2FA // Recovery-Codes
    @UsePipes(ValidationPipe)
    async exSetActivateConfigDobleFactorTOTP(
        @Args("login_id") login_id: number): Promise<DoblesFactores> {
        var doblefactor = await this.doblesFactoresService.getDobleFactorByLoginId(login_id);
        if (!doblefactor.esta_configurado) {
            return this.doblesFactoresService.exSetActivateConfigTwofactorTOTP(doblefactor);
        }
        return doblefactor;
    }

    @Query(returns => DoblesFactores)// Se cambia config_two_factor a 0
    @UsePipes(ValidationPipe)
    async exValidateRecoveryCode(
        @Args("data") data: CodigoRecuperacionInput): Promise<DoblesFactores> {
        return this.doblesFactoresService.exValidateRecoveryCode(data);
    }

    @Mutation(returns => DoblesFactores)//Email
    @UsePipes(ValidationPipe)
    async exSendMail(
        @Args("login_id") login_id: number,
        @Context() ctx): Promise<DoblesFactores> {
        try {
            var login = await this.loginService.getLoginById(login_id);
            var doblefactor = await this.doblesFactoresService.getDobleFactorByLoginId(login_id);
            var user = await this.loginService.getUsuarioById(login.usuario_id);
            var data = await this.doblesFactoresService.sendCodeMail(user, doblefactor, login);
            return data;
        } catch (error) {
            throw new UnauthorizedException("Unable to send verification code " + error);
        }
    }

    @Query(returns => DoblesFactores)
    @UsePipes(ValidationPipe)
    async exValidationCodeMail(
        @Args("data") data: ValidarCodigoInput): Promise<DoblesFactores> {
        var login = await this.loginService.getLoginById(data.login_id);
        var doblefactor = await this.doblesFactoresService.getDobleFactorByLoginId(data.login_id);
        return this.doblesFactoresService.validationCodeMail(data, login, doblefactor);
    }

}
