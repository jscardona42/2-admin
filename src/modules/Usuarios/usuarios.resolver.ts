import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ChangePasswordInput, MessageArrayInput, SendCodeVerificationInput, SignInUserInput, SignUpUserInput, ValidationCodeMailInput, ValidationCodeTotpInput, ValidationCodeVerificationInput, ValidationRecoveryCodeInput } from './dto/usuarios.dto';

import { Usuarios } from './entities/usuarios.entity';
import { UsuariosService } from './usuarios.service';

@Resolver(() => Usuarios)
export class UsuariosResolver {

    constructor(
        private readonly usuariosService: UsuariosService
    ) { }

    @Query(() => [Usuarios])
    async getUsuarios(): Promise<any> {
        return this.usuariosService.getUsuarios();
    }

    @Query(() => Usuarios)
    async getUsuarioById(
        @Args("usuario_id") usuario_id: number): Promise<Usuarios> {
        return this.usuariosService.getUsuarioById(usuario_id);
    }

    @Query(() => [Usuarios])
    async getFilterUsuarios(
        @Args("nombre", { nullable: true }) nombre: string,
        @Args("email", { nullable: true }) email: string): Promise<Usuarios[]> {
        return this.usuariosService.getFilterUsuarios(nombre, email);
    }

    @Query(() => Usuarios)
    async signInLogin(
        @Args("data") data: SignInUserInput): Promise<Usuarios> {
        return this.usuariosService.signInLogin(data);
    }

    @Mutation(() => Usuarios)
    async signUpLogin(
        @Args("data") data: SignUpUserInput): Promise<Usuarios> {
        return this.usuariosService.signUpLogin(data);
    }

    @Mutation(() => Usuarios)
    async logOutLogin(
        @Args("usuario_id") usuario_id: number): Promise<any> {
        return this.usuariosService.logOutLogin(usuario_id);
    }

    @Mutation(() => Usuarios)
    async exChangePasswordLogin(
        @Args("data") data: ChangePasswordInput): Promise<Usuarios> {
        return this.usuariosService.exChangePasswordLogin(data);
    }

    @Mutation(() => Usuarios)
    async exSendCodeVerification(
        @Args("data") data: SendCodeVerificationInput): Promise<any> {
        return this.usuariosService.exSendCodeVerification(data);
    }

    @Query(() => Usuarios)
    async exValidationCodeVerification(
        @Args("data") data: ValidationCodeVerificationInput): Promise<any> {
        return this.usuariosService.exValidationCodeVerification(data);
    }

    @Mutation(() => Usuarios)
    async exSendMail(
        @Args("usuario_id") usuario_id: number): Promise<any> {
        return this.usuariosService.sendCodeMail(usuario_id);
    }

    @Query(() => Usuarios)
    async exValidationCodeMail(
        @Args("data") data: ValidationCodeMailInput): Promise<any> {
        return this.usuariosService.validationCodeMail(data);
    }

    @Mutation(() => Usuarios)
    async exConfigTotp(
        @Args("usuario_id") usuario_id: number): Promise<any> {
        return this.usuariosService.configTotp(usuario_id);
    }

    @Mutation(() => Usuarios)
    async exSetActivateConfigTotp(
        @Args("usuario_id") usuario_id: number): Promise<any> {
        return this.usuariosService.exSetActivateConfigTotp(usuario_id);
    }

    @Query(() => Usuarios)
    async exValidateTotpCode(
        @Args("data") data: ValidationCodeTotpInput): Promise<any> {
        return this.usuariosService.exValidateTotpCode(data);
    }

    @Query(() => Usuarios)
    async exValidateRecoveryCode(
        @Args("data") data: ValidationRecoveryCodeInput): Promise<any> {
        return this.usuariosService.exValidateRecoveryCode(data);
    }
}
