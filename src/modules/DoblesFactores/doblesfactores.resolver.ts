import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { DoblesFactores } from './entities/doblesfactores.entity';
import { CodigoRecuperacionInput, configDoblesFactoresInput, DoblesFactoresValidarInput, ValidarCodigoInput } from './dto/doblesfactores.dto';
import { DoblesFactoresService } from './doblesfactores.service';
import { UsuariosService } from '../Usuarios/usuarios.service';
import { Usuarios } from '../Usuarios/entities/usuarios.entity';

var QRCode = require('qrcode')

@Resolver(() => DoblesFactores)
export class DoblesFactoresResolver {

    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly doblesFactoresService: DoblesFactoresService
    ) { }

    @Query(returns => DoblesFactores)
    @UsePipes(ValidationPipe)
    async getDobleFactorById(
        @Args("doblefactor_id") doblefactor_id: number): Promise<DoblesFactores> {
        return this.doblesFactoresService.getDobleFactorById(doblefactor_id);
    }

    @Query(returns => DoblesFactores)
    @UsePipes(ValidationPipe)
    async getDobleFactorByLoginId(
        @Args("usuario_id") usuario_id: number): Promise<DoblesFactores> {
        return this.doblesFactoresService.getDobleFactorByLoginId(usuario_id);
    }

    @Mutation(returns => DoblesFactores)
    @UsePipes(ValidationPipe)
    async createDobleFactor(
        @Args("data") data: configDoblesFactoresInput): Promise<DoblesFactores> {
        return this.doblesFactoresService.createDobleFactor(data);
    }

    @Mutation(returns => DoblesFactores)//Válido para 2FA
    @UsePipes(ValidationPipe)
    async configDobleFactor(
        @Args("usuario_id") usuario_id: number): Promise<Object> {

        var twofactorReturn = {};
        var user = await this.usuariosService.getUsuarioById(usuario_id);
        if (!user.tiene_doble_factor) {
            throw new UnauthorizedException("You must enable two-factor authentication for the user.");
        }
        var doblefactor = await this.doblesFactoresService.getDobleFactorByLoginId(usuario_id);
        if (doblefactor.metodo_validacion !== "TOTP") {
            throw new UnauthorizedException("The user does not have the two-factor function activated with TOTP.");
        }

        if (!doblefactor.esta_configurado) {
            const { otpauthUrl, secret } = await this.doblesFactoresService.generateDobleFactorAuthenticationSecret(user);
            const qrCodeUrl = await this.doblesFactoresService.buildQrCodeUrl(otpauthUrl);
            twofactorReturn = await this.doblesFactoresService.configDobleFactor(secret, usuario_id);
            return Object.assign(twofactorReturn, { qr_code: JSON.stringify(qrCodeUrl) });
        }

        twofactorReturn = await this.doblesFactoresService.getDobleFactorById(doblefactor.doble_factor_id);
        return Object.assign(twofactorReturn, { qr_code: "" });
    }

    @Mutation(returns => DoblesFactores)//Válido para 2FA // Recovery-Codes
    @UsePipes(ValidationPipe)
    async exSetActivateConfigDobleFactorTOTP(
        @Args("usuario_id") usuario_id: number): Promise<DoblesFactores> {
        var doblefactor = await this.doblesFactoresService.getDobleFactorByLoginId(usuario_id);
        if (doblefactor.metodo_validacion !== "TOTP") {
            throw new UnauthorizedException("The user does not have the two-factor function activated with TOTP.");
        }
        if (!doblefactor.esta_configurado) {
            return this.doblesFactoresService.exSetActivateConfigTwofactorTOTP(doblefactor);
        }
        return doblefactor;
    }

    @Query(returns => Usuarios)//Válido para 2FA
    @UsePipes(ValidationPipe)
    async exValidateDobleFactorCode(
        @Args("data") data: DoblesFactoresValidarInput): Promise<Usuarios> {

        const user = await this.usuariosService.getUsuarioById(data.usuario_id);
        const doblefactor = await this.doblesFactoresService.getDobleFactorByLoginId(data.usuario_id);

        const isCodeValid = this.doblesFactoresService.exValidateDobleFactorCode(
            data, doblefactor
        );

        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        return user;
    }

    @Query(returns => DoblesFactores)// Se cambia config_two_factor a false
    @UsePipes(ValidationPipe)
    async exValidateRecoveryCode(
        @Args("data") data: CodigoRecuperacionInput): Promise<DoblesFactores> {
        return this.doblesFactoresService.exValidateRecoveryCode(data);
    }

    @Mutation(returns => DoblesFactores)//Email
    @UsePipes(ValidationPipe)
    async exSendMail(
        @Args("usuario_id") usuario_id: number,
        @Context() ctx): Promise<DoblesFactores> {
        try {
            var user = await this.usuariosService.getUsuarioById(usuario_id);
            var doblefactor = await this.doblesFactoresService.getDobleFactorByLoginId(usuario_id);
            return this.doblesFactoresService.sendCodeMail(user, doblefactor);
        } catch (error) {
            throw new UnauthorizedException("Unable to send verification code " + error);
        }
    }

    @Query(returns => DoblesFactores)
    @UsePipes(ValidationPipe)
    async exValidationCodeMail(
        @Args("data") data: ValidarCodigoInput): Promise<DoblesFactores> {
        var user = await this.usuariosService.getUsuarioById(data.usuario_id);
        var doblefactor = await this.doblesFactoresService.getDobleFactorByLoginId(data.usuario_id);
        return this.doblesFactoresService.validationCodeMail(data, user, doblefactor);
    }

}
