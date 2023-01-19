import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import * as CryptoJS from 'crypto-js';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordInput, CreateUsuarioInput, SendCodeVerificationInput, ValidationCodeMailInput, ValidationCodeTotpInput, ValidationCodeVerificationInput, ValidationRecoveryCodeInput } from './dto/usuarios.dto';
import { authenticator } from 'otplib';
import { AuthenticationError } from 'apollo-server-express';
let QRCode = require('qrcode');
const SibApiV3Sdk = require('sib-api-v3-typescript');
import axios from 'axios';
import { PerfilesService } from '../Perfiles/perfiles.service';



@Injectable()
export class UsuariosService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private perfilesService: PerfilesService
    ) { }

    async getUsuarios(): Promise<any> {
        return this.prismaService.usuarios.findMany({
            include: { UsuariosSesionesSec: true, UsuariosHistoricoContrasenasSec: true, TbEstadosUsuarios: true, TbMetodosAutenticacion: true, UsuariosPerfiles: { include: { Perfiles: true } }, TbTipoUsuarios: true, UsuariosParametrosValores: { include: { UsuariosParametros: true } } }
        });
    }

    async getUsuarioById(usuario_id: number): Promise<any> {
        let usuarios = await this.prismaService.usuarios.findUnique({
            where: { usuario_id: usuario_id },
            include: { UsuariosSesionesSec: true, UsuariosHistoricoContrasenasSec: true, TbEstadosUsuarios: true, TbMetodosAutenticacion: true, UsuariosPerfiles: { include: { Perfiles: true } }, TbTipoUsuarios: true, UsuariosParametrosValores: { include: { UsuariosParametros: true } } }
        })

        if (usuarios === null) {
            throw new UnauthorizedException({ error_code: "009", message: "El usuario no se encuentra registrado" });
        }

        return usuarios;
    }

    async getUsuarioByUsername(nombre_usuario: string): Promise<any> {
        let user = await this.prismaService.usuarios.findFirst({
            where: { nombre_usuario: nombre_usuario },
            select: { TbEstadosUsuarios: true, TbMetodosAutenticacion: true, usuario_id: true, correo: true, salt: true, sol_cambio_contrasena: true, nombre_usuario: true, estado_usuario_id: true, metodo_autenticacion_id: true, cant_intentos: true, fecha_creacion: true, fecha_vigencia_contrasena: true }
        })

        if (user === null) {
            throw new UnauthorizedException({ error_code: "009", message: "El usuario no se encuentra registrado" });
        }

        return user;
    }

    async getDataErrorReturn(usuario_id: number): Promise<any> {
        let user = await this.prismaService.usuarios.findUnique({
            where: { usuario_id: usuario_id },
            select: { usuario_id: true, correo: true, nombre_usuario: true, TbMetodosAutenticacion: true }
        })

        if (user === null) {
            throw new UnauthorizedException({ error_code: "009", message: "El usuario no se encuentra registrado" });
        }

        return user;
    }

    async getFilterUsuarios(nombre_usuario: string, correo: string): Promise<any> {
        return this.prismaService.usuarios.findMany({
            where: {
                OR:
                    [
                        { nombre_usuario: { contains: nombre_usuario, mode: "insensitive" } },
                        { correo: { contains: correo, mode: "insensitive" } }
                    ]
            }
        })
    }

    async createUsuario(data: CreateUsuarioInput): Promise<any> {
        let metodoAutenticacion = undefined;
        let parametrosValores: any = [];
        let user: any;
        let usuariosperfilesarray = [];

        if (data.UsuariosPerfiles !== undefined) {
            await data.UsuariosPerfiles.reduce(async (promise0, usuariosperfiles) => {
                await promise0;

                await this.perfilesService.getPerfilById(usuariosperfiles.perfil_id)

                usuariosperfilesarray.push({
                    perfil_id: usuariosperfiles.perfil_id
                })

            }, Promise.resolve());
        }

        const salt = await bcrypt.genSalt();
        const usernameExists = await this.usernameExists(data.nombre_usuario);
        if (usernameExists) {
            throw new UnauthorizedException({ error_code: "010", message: "El usuario ya se encuentra registrado" });
        }
        let contrasena_provisional = this.createRandomPassword();

        if (data.metodo_autenticacion_id !== undefined && data.metodo_autenticacion_id !== null) {
            metodoAutenticacion = { connect: { metodo_autenticacion_id: data.metodo_autenticacion_id } };
        }

        const usuariosParametros = await this.prismaService.usuariosParametros.findMany();

        usuariosParametros.forEach(parametro => {
            parametrosValores.push(
                {
                    usuario_parametro_id: parametro.usuario_parametro_id,
                    valor: parametro.valor_defecto
                });
        });

        let vigencia = await this.getUsuarioParametros(0, "autvigenciacontrasena");
        let newDate = await this.getLocaleDate();

        try {
            user = await this.prismaService.usuarios.create({
                data: {
                    nombre_usuario: data.nombre_usuario,
                    contrasena: await this.hashPassword(contrasena_provisional, salt),
                    correo: data.correo,
                    salt: salt,
                    fecha_vigencia_contrasena: await this.addDaysToDate(newDate, parseInt(vigencia.valor)),
                    fecha_creacion: newDate,
                    fecha_actualizacion: newDate,
                    TbEstadosUsuarios: { connect: { estado_usuario_id: data.estado_usuario_id } },
                    TbMetodosAutenticacion: metodoAutenticacion,
                    TbTipoUsuarios: { connect: { tipo_usuario_id: data.tipo_usuario_id } },
                    sol_cambio_contrasena: true,
                    UsuariosParametrosValores: {
                        create: parametrosValores
                    },
                    UsuariosPerfiles: {
                        create: usuariosperfilesarray
                    }
                },
                include: { UsuariosSesionesSec: true, UsuariosHistoricoContrasenasSec: true, TbEstadosUsuarios: true, TbTipoUsuarios: true, UsuariosPerfiles: true, TbMetodosAutenticacion: true, UsuariosParametrosValores: { include: { UsuariosParametros: true } } }
            })
        } catch (error) {
            if (error.code === 'P2002') {
                throw new UnauthorizedException(`El ${error.meta.target[0]} ya se encuentra registrado`);
            }
            throw new UnauthorizedException("Ocurrió un error durante la creación del usuario " + error);
        }

        let params = { name: user.nombre_usuario, password: contrasena_provisional };
        let userReturn = await this.getDataErrorReturn(user.usuario_id);
        let res = await this.sendNotificacionCorreo("usuario_nuevo", userReturn, params);
        if (res.statusCode !== 200) {
            throw new UnauthorizedException({ message: "No se puede enviar la clave temporal", error: res.error, error_code: res.error_code });
        }

        return user;
    }

    async signInLogin(data: any): Promise<any> {

        const salt = await this.prismaService.usuarios.findFirst({
            where: { nombre_usuario: data.nombre_usuario },
            select: { salt: true, cant_intentos: true, },
        })

        if (salt === null) {
            throw new UnauthorizedException({ error_code: "004", message: "Credenciales inválidas" });
        }

        let usuario = await this.getUsuarioByUsername(data.nombre_usuario);
        if (usuario.TbEstadosUsuarios.nombre === "INACTIVO") {
            throw new UnauthorizedException({ error_code: "012", message: "Usuario inactivo" });
        }
        let numerocontrasenas = await this.getUsuarioParametros(usuario.usuario_id, "autnummaxintentos")
        if (!usuario.sol_cambio_contrasena) {
            let vencimientocontrasena = await this.getUsuarioParametros(usuario.usuario_id, "autvctocontrasena");
            if (vencimientocontrasena.valor == "true") {

                let newDate = await this.getLocaleDate();

                if (newDate >= usuario.fecha_vigencia_contrasena) {
                    await this.statusChange(data.nombre_usuario)
                    let userReturn = await this.getDataErrorReturn(usuario.usuario_id);
                    throw new UnauthorizedException({ error_code: "002", message: "La contraseña ha expirado", data: userReturn });
                }
            }
        }

        if (usuario.cant_intentos >= numerocontrasenas.valor) {
            let userReturn = await this.getDataErrorReturn(usuario.usuario_id);
            throw new UnauthorizedException({ error_code: "003", message: "Bloquedo por intentos fallidos", data: userReturn });
        }

        const user = await this.prismaService.usuarios.findFirst({
            where: {
                nombre_usuario: data.nombre_usuario,
                contrasena: await this.hashPassword(data.contrasena, salt.salt)
            },
            include: { UsuariosSesionesSec: true, UsuariosHistoricoContrasenasSec: true, TbEstadosUsuarios: true, TbTipoUsuarios: true, UsuariosPerfiles: true, TbMetodosAutenticacion: true, UsuariosParametrosValores: { include: { UsuariosParametros: true } } }
        })

        if (!user) {
            await this.addIntentos(data.nombre_usuario)
            if (usuario.cant_intentos + 1 >= numerocontrasenas.valor) {
                await this.statusChange(data.nombre_usuario)
            }
            throw new UnauthorizedException({ error_code: "004", message: "Credenciales inválidas" });
        }

        if (user.sol_cambio_contrasena) {
            let userReturn = await this.getDataErrorReturn(usuario.usuario_id);
            throw new UnauthorizedException({ error_code: "001", message: "Usuario nuevo", data: userReturn });
        }

        if (user.metodo_autenticacion_id !== null) {
            return user;
        }

        const token = this.jwtService.sign({ userId: user.usuario_id });
        await this.renewCantidadIntentos(user.usuario_id);

        return this.createToken(token, user);
    }

    async createHistoricoContrasena(data: any) {
        return this.prismaService.usuarios.update({
            where: { usuario_id: data.usuario_id_ },
            data: {
                UsuariosHistoricoContrasenasSec: {
                    create: {
                        contrasena: data.contrasena,
                        fecha_actualizacion: new Date()
                    }
                }
            }
        })
    }

    async logOutLogin(usuario_id) {
        await this.getUsuarioById(usuario_id);
        return this.prismaService.usuarios.update({
            where: { usuario_id: usuario_id },
            data: {
                UsuariosSesionesSec: {
                    update: {
                        token: null
                    }
                }
            }
        })
    }

    async exChangePasswordLogin(data: ChangePasswordInput): Promise<any> {

        let usuario = await this.getUsuarioById(data.usuario_id);
        const salt = await this.prismaService.usuarios.findFirst({
            where: { usuario_id: usuario.usuario_id },
            select: { salt: true },
        })

        if (salt === null) {
            throw new UnauthorizedException({ error_code: "004", message: "Credenciales inválidas" });
        }
        if (usuario.sol_cambio_contrasena && (data.contrasena !== undefined && data.contrasena !== null)) {
            const login = await this.prismaService.usuarios.findFirst({
                where: {
                    contrasena: await this.hashPassword(data.contrasena, salt.salt),
                    usuario_id: data.usuario_id
                },
            })

            if (login === null) {
                throw new UnauthorizedException({ error_code: "004", message: "Credenciales inválidas" });
            }
        }

        await this.ValidationHistoricoContrasenas(data);
        let newDate = await this.getLocaleDate();

        let usuarioparametro = await this.getUsuarioParametros(data.usuario_id, "autvigenciacontrasena")
        let tiempo00 = await this.addDaysToDate(newDate, parseInt(usuarioparametro.valor))
        let estadoUsuario = await this.getEstadoUsuario("ACTIVO");

        await this.getUsuarioById(data.usuario_id);

        let user = await this.prismaService.usuarios.update({
            where: { usuario_id: data.usuario_id },
            data: {
                contrasena: await this.hashPassword(data.nueva_contrasena, salt.salt),
                estado_usuario_id: estadoUsuario.estado_usuario_id,
                sol_cambio_contrasena: false,
                cant_intentos: 0,
                fecha_vigencia_contrasena: tiempo00,
                fecha_actualizacion: newDate,
                UsuariosHistoricoContrasenasSec: {
                    create: {
                        contrasena: await this.hashPassword(data.nueva_contrasena, salt.salt),
                        fecha_actualizacion: newDate
                    }
                }
            },
            include: { UsuariosSesionesSec: true, UsuariosHistoricoContrasenasSec: true, TbEstadosUsuarios: true, TbTipoUsuarios: true, UsuariosPerfiles: true, TbMetodosAutenticacion: true, }
        })

        let params = { name: user.nombre_usuario };
        let res = await this.sendNotificacionCorreo("confirmacion", usuario, params);
        if (res.statusCode !== 200) {
            throw new UnauthorizedException({ message: "No se pudo enviar el correo de confirmación", error: res.error, error_code: res.error_code });
        }
        return user;
    }

    async ValidationHistoricoContrasenas(data: any) {

        let user = await this.getUsuarioById(data.usuario_id);
        let numerocontrasenas = await this.getUsuarioParametros(data.usuario_id, "autnumcontant")
        let historialcontrasenas = await this.prismaService.usuariosHistoricoContrasenas.findMany({
            take: parseInt(numerocontrasenas.valor),
            orderBy: { fecha_actualizacion: "desc" },
            where: {
                usuario_id: user.usuario_id
            },
            select: { usu_historico_contrasena_id: true }
        })

        let hisids = []
        historialcontrasenas.forEach((his) => {
            hisids.push(his.usu_historico_contrasena_id)
        })

        let validacioncontrasenas = await this.prismaService.usuariosHistoricoContrasenas.findMany({
            where: {
                usu_historico_contrasena_id: { in: hisids }, contrasena: await this.hashPassword(data.nueva_contrasena, user.salt)
            },
        })

        if (user.nombre_usuario == data.nueva_contrasena) {
            throw new UnauthorizedException({ error_code: "005", message: "La contraseña no puede ser igual al nombre de usuario" });
        }

        if (validacioncontrasenas.length > 0) {
            throw new UnauthorizedException({ error_code: "006", message: "La contraseña no puede ser igual a una contraseña anterior" });
        }

    }

    public async exSendCodeVerification(data: SendCodeVerificationInput) {

        const usernameExists = await this.usernameExists(data.nombre_usuario);
        if (!usernameExists) {
            throw new UnauthorizedException({ error_code: "009", message: "El usuario no se encuentra registrado" });
        }

        const user = await this.getUsuarioByUsername(data.nombre_usuario)

        if (user.sol_cambio_contrasena && data.tipo_solicitud !== "NUEVO") {
            throw new UnauthorizedException({ error_code: "008", message: "Usuario nuevo, no puede cambiar su contraseña" });
        }

        let recoveryCode = this.randomCode(9999999999).padStart(6, "0");
        let hashRecoveryCode = await bcrypt.hash(recoveryCode, user.salt);
        let parametrovalor = await this.getUsuarioParametros(user.usuario_id, "autcodrestabcontra")
        let parametrovalor1 = await this.getUsuarioParametros(user.usuario_id, "autfecharestabcontra")

        let time1 = Date.parse(parametrovalor1.valor);
        let time2 = new Date(time1);
        let tiempo = await this.timeCalculateSecs(time2);
        if (tiempo <= 60) {
            let userReturn = await this.getDataErrorReturn(user.usuario_id);
            throw new UnauthorizedException({ error_code: "007", message: "Debe esperar 60 segundos para volver a generar el codigo de verificación", data: userReturn });
        }

        await this.updateUsuarioParametro(user.usuario_id, hashRecoveryCode, parametrovalor.usuario_parametro_valor_id,)
        let updateData = await this.updateUsuarioParametro(user.usuario_id, new Date().toString(), parametrovalor1.usuario_parametro_valor_id,);

        let params = { name: user.nombre_usuario, codigo: recoveryCode };
        let res = await this.sendNotificacionCorreo("codigo_verificacion", user, params);
        if (res.statusCode !== 200) {
            throw new UnauthorizedException({ message: "No se pudo enviar el código de verificación", error: res.error, error_code: res.error_code });
        }
        return updateData;
    }

    public async exValidationCodeVerification(data: ValidationCodeVerificationInput): Promise<any> {

        const usuario = await this.getUsuarioById(data.usuario_id)

        let Result = await this.prismaService.usuariosParametrosValores.findFirst({
            where: {
                usuario_id: usuario.usuario_id,
                valor: await bcrypt.hash(data.codigo, usuario.salt)
            },
        })

        if (Result === null) {
            throw new UnauthorizedException({ error_code: "011", message: "El código es incorrecto, vuelve a intentarlo" });
        }

        return usuario;
    }

    public async sendCodeMail(usuario_id: number) {

        let user = await this.getUsuarioById(usuario_id);

        await this.validateMetodoAutenticacion(user, "EMAIL");

        let id = await this.getUsuarioParametros(user.usuario_id, "autemailcodrecup")
        let fecha = await this.getUsuarioParametros(user.usuario_id, "autfechacodrecup")

        let validacion = await this.prismaService.usuariosParametrosValores.findFirst({
            where: { usuario_parametro_valor_id: fecha.usuario_parametro_valor_id },
            select: { valor: true }
        })
        let tiempo = await this.timeCalculateSecs(new Date(validacion.valor));
        if (tiempo > 60) {
            let recoveryCode = this.randomCode(999999).padStart(6, "0");
            let hashRecoveryCode = bcrypt.hash(recoveryCode, user.salt);

            this.updateUsuarioParametro(user.usuario_id, await hashRecoveryCode, id.usuario_parametro_valor_id)

            this.updateUsuarioParametro(user.usuario_id, new Date().toString(), fecha.usuario_parametro_valor_id)

            let params = { name: user.nombre_usuario, codigo: recoveryCode };
            let res = await this.sendNotificacionCorreo("codigo_email", user, params);
            if (res.statusCode !== 200) {
                throw new UnauthorizedException({ message: "No se pudo enviar el código de verificación", error: res.error, error_code: res.error_code });
            }
            return user;
        }
        else throw new UnauthorizedException({ error_code: "014", message: "Debe esperar 60 segundos para volver a generar el código de verificación" });
    }

    public async validationCodeMail(data: ValidationCodeMailInput): Promise<any> {

        let user = await this.getUsuarioById(data.usuario_id);
        await this.validateMetodoAutenticacion(user, "EMAIL");

        let codigo_acceso = await this.getUsuarioParametros(user.usuario_id, "autemailcodrecup")
        let fecha = await this.getUsuarioParametros(user.usuario_id, "autfechacodrecup")

        if (fecha.valor == null) {
            throw new UnauthorizedException("El usuario no tiene configurado el parámetro autfechacodrecup");
        }

        let tiempo = await this.timeCalculateSecs(fecha.valor);
        if (tiempo > (15 * 60)) {
            throw new UnauthorizedException({ error_code: "013", message: "El código expiró, recuerde que la vigencia del código es de 15 minutos" });
        }

        if (codigo_acceso.valor !== await bcrypt.hash(data.codigo, user.salt)) {
            throw new UnauthorizedException({ error_code: "011", message: "El código es incorrecto, vuelve a intentarlo" });
        }

        const token = this.jwtService.sign({ userId: user.usuario_id });
        await this.renewCantidadIntentos(user.usuario_id);
        return this.createToken(token, user);
    }

    async configTotp(usuario_id: number): Promise<any> {

        let user = await this.getUsuarioById(usuario_id);
        await this.validateMetodoAutenticacion(user, "TOTP");

        let configuracion_TOTP = await this.getUsuarioParametros(usuario_id, "auttotpconfig")
        let otplib_secreta = await this.getUsuarioParametros(usuario_id, "auttotplibsecreta")

        if (configuracion_TOTP.valor == "false") {

            const { otpauthUrl, secret } = await this.generateAuthenticationSecret(usuario_id);
            const qrCodeUrl = await this.buildQrCodeUrl(otpauthUrl);

            await this.prismaService.usuariosParametrosValores.update({
                where: { usuario_parametro_valor_id: otplib_secreta.usuario_parametro_valor_id },
                data: {
                    valor: secret
                }
            })

            let usuario = await this.getUsuarioById(usuario_id);

            return Object.assign(usuario, { qr_code: JSON.stringify(qrCodeUrl), config_totp: configuracion_TOTP.valor });
        }
        return Object.assign(user, { qr_code: "", config_totp: configuracion_TOTP.valor });
    }

    async exSetActivateConfigTotp(usuario_id: number): Promise<any> {

        let user = await this.getUsuarioById(usuario_id);
        await this.validateMetodoAutenticacion(user, "TOTP");
        let usuario_parametro_config = await this.getUsuarioParametros(usuario_id, "auttotpconfig");
        let usuario_parametro_codigo = await this.getUsuarioParametros(usuario_id, "auttotpcodrecup");

        if (usuario_parametro_config.valor == "true") {
            throw new UnauthorizedException("El usuario ya tiene configurado un método de autenticación TOTP");
        }

        try {
            let recoveryCode = this.generateRecoveryCode(20);
            let params = { name: user.nombre_usuario, codigo: recoveryCode };
            let res = await this.sendNotificacionCorreo("codigo_recuperacion", user, params);
            if (res.statusCode !== 200) {
                throw new UnauthorizedException({ message: "No se pudo generar el código de recuperación", error: res.error, error_code: res.error_code });
            }

            await this.updateUsuarioParametro(usuario_id, "true", usuario_parametro_config.usuario_parametro_valor_id);

            await this.updateUsuarioParametro(usuario_id, await this.hashPassword(recoveryCode, user.salt), usuario_parametro_codigo.usuario_parametro_valor_id);

            return Object.assign(user, { cod_recuperacion: recoveryCode });
        } catch (error) {
            throw new UnauthorizedException("No se pudo generar el código de recuperación");
        }
    }

    public async exValidateTotpCode(data: ValidationCodeTotpInput) {

        let user = await this.getUsuarioById(data.usuario_id);
        let otplib_secreta = await this.getUsuarioParametros(data.usuario_id, "auttotplibsecreta");

        let secret_code = await this.prismaService.usuariosParametrosValores.findFirst({
            where: { usuario_parametro_valor_id: otplib_secreta.usuario_parametro_valor_id },
            select: { valor: true }
        })

        if (secret_code.valor == null) {
            throw new UnauthorizedException('El usuario no tiene configurada una otplib secreta');
        }

        let isCodeValid = authenticator.verify({
            token: data.codigo_acceso,
            secret: secret_code.valor
        })
        if (!isCodeValid) {
            throw new UnauthorizedException({ error_code: "015", message: "El código de validación es incorrecto." });
        }
        const token = this.jwtService.sign({ userId: user.usuario_id });
        await this.renewCantidadIntentos(user.usuario_id);
        return this.createToken(token, user);
    }

    async exValidateRecoveryCode(data: ValidationRecoveryCodeInput): Promise<any> {
        let user = await this.getUsuarioById(data.usuario_id);

        let parametro_recuperacion = await this.getUsuarioParametros(data.usuario_id, "auttotpcodrecup");
        let parametro_config = await this.getUsuarioParametros(data.usuario_id, "auttotpconfig");

        if (parametro_recuperacion.valor !== await this.hashPassword(data.codigo_recuperacion, user.salt)) {
            throw new UnauthorizedException({ error_code: "016", message: "El código de recuperación no es válido." });
        }
        await this.updateUsuarioParametro(data.usuario_id, "false", parametro_config.usuario_parametro_valor_id);

        return user;
    }

    async createToken(token: string, user): Promise<any> {

        return this.prismaService.usuarios.update({
            where: { usuario_id: user.usuario_id, },
            data: {
                UsuariosSesionesSec: {
                    upsert: {
                        create: {
                            token: token,
                            fecha_ultimo_login: new Date()
                        },
                        update: {
                            token: token,
                            fecha_ultimo_login: new Date()
                        }
                    }
                }
            },
            include: { UsuariosSesionesSec: true, UsuariosHistoricoContrasenasSec: true, TbEstadosUsuarios: true, TbTipoUsuarios: true, UsuariosPerfiles: true, TbMetodosAutenticacion: true, }
        })
    }

    async validateMetodoAutenticacion(user: any, metodo: string) {
        if (user.metodo_autenticacion_id === null || user.metodo_autenticacion_id === undefined) {
            throw new UnauthorizedException("El usuario no tiene activa la doble autenticación");
        }

        if (user.TbMetodosAutenticacion.nombre !== metodo) {
            throw new UnauthorizedException("El usuario no tiene configurada la doble autenticación con", metodo);
        }
    }

    public async updateUsuarioParametro(usuario_id: number, valor: string, usuario_parametro_valor_id: number) {

        return this.prismaService.usuarios.update({
            where: { usuario_id: usuario_id },
            include: { UsuariosParametrosValores: true },
            data: {
                UsuariosParametrosValores: {
                    update: {
                        where: { usuario_parametro_valor_id: usuario_parametro_valor_id },
                        data: {
                            valor: valor
                        }
                    }
                }
            }
        });
    }

    public async getUsuarioParametros(usuario_id: number, alias: string) {
        let usuarioparametro = await this.prismaService.usuariosParametros.findFirst({
            where: { alias: alias },
            select: { usuario_parametro_id: true, valor_defecto: true }
        })
        let parametrovalor = await this.prismaService.usuariosParametrosValores.findFirst({
            where: { usuario_parametro_id: usuarioparametro.usuario_parametro_id, usuario_id: usuario_id },
        })

        if (parametrovalor !== null) {
            if (parametrovalor.valor !== null) {
                return parametrovalor;
            } else {
                Object.assign(parametrovalor, { valor: usuarioparametro.valor_defecto });
            }
        } else {
            parametrovalor = { usuario_parametro_valor_id: 0, valor: usuarioparametro.valor_defecto, usuario_id: 0, usuario_parametro_id: usuarioparametro.usuario_parametro_id }
            Object.assign(parametrovalor, { valor: usuarioparametro.valor_defecto });
        }
        return parametrovalor;
    }

    async usernameExists(nombre_usuario): Promise<any> {
        const user = await this.prismaService.usuarios.findFirst({
            where: { nombre_usuario: nombre_usuario },
            select: { nombre_usuario: true }
        })

        if (user === null) {
            return false;
        } else {
            return true;
        }
    }

    async hashPassword(contrasena: string, salt: string): Promise<any> {
        return bcrypt.hash(contrasena, salt);
    }

    randomCode(max: number): string {
        let min = 0;
        let Code = Math.floor(Math.random() * (max - min)) + min;
        return Code.toString();
    }

    createRandomPassword(): string {
        return Math.random().toString(36).slice(-8);
    }

    async addIntentos(nombre_usuario) {

        const usuario = await this.getUsuarioByUsername(nombre_usuario)
        await this.prismaService.usuarios.update({
            where: { usuario_id: usuario.usuario_id },
            data: {
                cant_intentos: { increment: 1 }
            }
        })
    }

    async getEstadoUsuario(nombre: string) {
        let estado = await this.prismaService.tbEstadosUsuarios.findFirst({
            where: { nombre: nombre }
        });

        if (estado === null) {
            throw new UnauthorizedException(`El estado ${nombre} no existe`);
        }
        return estado;
    }

    async statusChange(nombre_usuario) {

        const usuario = await this.getUsuarioByUsername(nombre_usuario);
        let estadoUsuario = await this.getEstadoUsuario("BLOQUEADO");

        await this.prismaService.usuarios.update({
            where: { usuario_id: usuario.usuario_id },
            data: {
                estado_usuario_id: estadoUsuario.estado_usuario_id
            }
        })
    }

    public async timeCalculateDays(user) {
        let date1 = new Date(user.fecha_creacion);
        let date2 = new Date();
        let time = date2.getTime() - date1.getTime();
        return time / (86400000);
    }

    public async timeCalculateSecs(fecha_creacion: any) {
        let date1 = new Date(fecha_creacion);
        let date2 = new Date();
        let time = date2.getTime() - date1.getTime();
        return Math.round(time / (1000));
    }

    public async addDaysToDate(date, days) {
        let res = new Date(date);
        res.setDate(res.getDate() + days);
        return res;
    }

    public async generateAuthenticationSecret(usuario_id: number) {
        let user = await this.getUsuarioById(usuario_id);

        authenticator.options = { window: 0 };
        const secret = authenticator.generateSecret();
        const otpauthUrl = authenticator.keyuri(user.correo, "Maia ERP", secret);
        return { secret, otpauthUrl }
    }

    async buildQrCodeUrl(str): Promise<Object> {
        return new Promise(function (resolve) {
            QRCode.toDataURL(str, function (err, url) {
                if (err) {
                    throw new AuthenticationError("No se puedo construir el código QR");
                }
                resolve(url);
            });
        });
    }

    generateRecoveryCode(max): string {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < max; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    async getLocaleDate() {
        let date = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
        let newDate = new Date(date);
        newDate.setHours(newDate.getHours() - 6);
        return newDate;
    }

    async renewCantidadIntentos(usuario_id: number) {
        await this.prismaService.usuarios.update({
            where: { usuario_id: usuario_id },
            data: {
                cant_intentos: 0,
            }
        })
    }

    public async sendNotificacionCorreo(nombre_plantilla: string, user: any, params: any) {

        let referer = jwt.sign({ userId: user.usuario_id }, process.env.JWT_SECRET_URL);
        referer = CryptoJS.AES.encrypt(referer, process.env.KEY_CRYPTO_ADMIN).toString();

        let data = {
            proveedor_mensajeria_id: 1,
            correo: user.correo,
            nombre_usuario: user.nombre_usuario,
            params: params,
            nombre_plantilla: nombre_plantilla
        }

        let res = await axios.post(`${process.env.NOTIFICACIONES_URL}/notificaciones/email`, data, { headers: { Authorization_url: referer } })
            .then((res) => { return res.data })
            .catch(err => { return err.response.data });
        console.log(res);
        return res;
    }

}
