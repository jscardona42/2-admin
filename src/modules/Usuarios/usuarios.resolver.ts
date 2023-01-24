import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ChangePasswordInput, CreateUsuarioInput, SendCodeVerificationInput, SignInUserInput, UpdateUsuarioInput, ValidationCodeMailInput, ValidationCodeTotpInput, ValidationCodeVerificationInput, ValidationRecoveryCodeInput } from './dto/usuarios.dto';

import { Usuarios } from './entities/usuarios.entity';
import { UsuariosService } from './usuarios.service';

@Resolver(() => Usuarios)
export class UsuariosResolver {

    constructor(
        private readonly usuariosService: UsuariosService
    ) { }

    @Query(() => [Usuarios], { description: "Obtener todos los elementos de la tabla Usuarios" })
    async getUsuarios(): Promise<any> {
        return this.usuariosService.getUsuarios();
    }

    @Query(() => Usuarios, { description: "Obtener un elemento de la tabla Usuarios por id" })
    async getUsuarioById(
        @Args("usuario_id") usuario_id: number): Promise<Usuarios> {
        return this.usuariosService.getUsuarioById(usuario_id);
    }

    @Query(() => [Usuarios], { description: "Obtener uno o varios elementos filtrados de la tabla Usuarios" })
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

    @Mutation(() => Usuarios, { description: "Crear un nuevo elemento en la tabla Usuarios" })
    async createUsuario(
        @Args("data") data: CreateUsuarioInput): Promise<Usuarios> {
        return this.usuariosService.createUsuario(data);
    }

    @Mutation(() => Usuarios, { description: "Actualizar un elemento de la tabla Usuarios" })
    async updateUsuario(@Args("data") data: UpdateUsuarioInput): Promise<any> {
        return this.usuariosService.updateUsuario(data);
    }

    @Mutation(() => Usuarios, { description: "Cierre de sesión" })
    async logOutLogin(
        @Args("usuario_id") usuario_id: number): Promise<any> {
        return this.usuariosService.logOutLogin(usuario_id);
    }

    @Mutation(() => Usuarios, { description: "Cambio de contraseña" })
    async exChangePasswordLogin(
        @Args("data") data: ChangePasswordInput): Promise<Usuarios> {
        return this.usuariosService.exChangePasswordLogin(data);
    }

    @Mutation(() => Usuarios, { description: "Envío de código de verificación" })
    async exSendCodeVerification(
        @Args("data") data: SendCodeVerificationInput): Promise<any> {
        return this.usuariosService.exSendCodeVerification(data);
    }

    @Query(() => Usuarios, { description: "Validar código de verificación" })
    async exValidationCodeVerification(
        @Args("data") data: ValidationCodeVerificationInput): Promise<any> {
        return this.usuariosService.exValidationCodeVerification(data);
    }

    @Mutation(() => Usuarios, { description: "Enviar correo con código de verificación" })
    async exSendMail(
        @Args("usuario_id") usuario_id: number): Promise<any> {
        return this.usuariosService.sendCodeMail(usuario_id);
    }

    @Query(() => Usuarios, { description: "Validar código de verificación enviado al correo" })
    async exValidationCodeMail(
        @Args("data") data: ValidationCodeMailInput): Promise<any> {
        return this.usuariosService.validationCodeMail(data);
    }

    @Mutation(() => Usuarios, { description: "Configurar método TOTP" })
    async exConfigTotp(
        @Args("usuario_id") usuario_id: number): Promise<any> {
        return this.usuariosService.configTotp(usuario_id);
    }

    @Mutation(() => Usuarios, { description: "Activar método TOTP" })
    async exSetActivateConfigTotp(
        @Args("usuario_id") usuario_id: number): Promise<any> {
        return this.usuariosService.exSetActivateConfigTotp(usuario_id);
    }

    @Query(() => Usuarios, { description: "Validar código del mpetodo TOTP" })
    async exValidateTotpCode(
        @Args("data") data: ValidationCodeTotpInput): Promise<any> {
        return this.usuariosService.exValidateTotpCode(data);
    }

    @Query(() => Usuarios, { description: "Validar código de recuperación TOTP" })
    async exValidateRecoveryCode(
        @Args("data") data: ValidationRecoveryCodeInput): Promise<any> {
        return this.usuariosService.exValidateRecoveryCode(data);
    }
}
