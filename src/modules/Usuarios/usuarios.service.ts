import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { TbRolesService } from '../GestionFuncionalidades/Roles/roles.service';
import { ChangePasswordInput, CodigoRecuperacionInput, DoblesFactoresValidarInput, SendCodeVerificationInput, SignUpUserInput, ValidationCodeMailInput, ValidationCodeVerificationInput } from './dto/usuarios.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { authenticator } from 'otplib';
import { AuthenticationError } from 'apollo-server-express';
let QRCode = require('qrcode')



@Injectable()
export class UsuariosService {
    constructor(
        private prismaService: PrismaService,
        private rolesService: TbRolesService,
        private mailerService: MailerService,
        private jwtService: JwtService,
    ) { }

    async getUsuarios(): Promise<any> {
        return this.prismaService.usuarios.findMany({
            include: { UsuariosSesionesSec: true, TbEstadosUsuarios: true, TbMetodosAutenticacion: true, TbRoles: true, TbTipoUsuarios: true, UsuarioParametroValor: { include: { UsuariosParametros: true } } }
        });
    }

    async getUsuarioById(usuario_id: number): Promise<any> {
        let usuarios = await this.prismaService.usuarios.findUnique({
            where: { usuario_id: usuario_id },
            include: { UsuariosSesionesSec: true, TbEstadosUsuarios: true, TbMetodosAutenticacion: true, TbRoles: true, TbTipoUsuarios: true, UsuarioParametroValor: { include: { UsuariosParametros: true } } }
        })

        if (usuarios === null) {
            throw new UnauthorizedException({ error_code: "009", message: "El usuario no se encuentra registrado" });
        }

        return usuarios;
    }

    async getUsuarioByUsername(nombre_usuario: string): Promise<any> {
        let user = await this.prismaService.usuarios.findFirst({
            where: { nombre_usuario: nombre_usuario },
            select: { TbEstadosUsuarios: true, TbMetodosAutenticacion: true, usuario_id: true, correo: true, salt: true, sol_cambio_contrasena: true, nombre_usuario: true, estado_usuario_id: true, metodo_autenticacion_id: true, cant_intentos: true }
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

    async signUpLogin(data: SignUpUserInput): Promise<any> {
        let metodoAutenticacion = undefined;
        let parametrosIds: any = [];

        await this.rolesService.getRolById(data.rol_id);
        const salt = await bcrypt.genSalt();
        const usernameExists = await this.usernameExists(data.nombre_usuario);
        if (usernameExists) {
            throw new UnauthorizedException({ error_code: "010", message: "El usuario ya se encuentra registrado" });
        }
        let contrasena_provisional = this.createRandomPassword();

        if (data.metodo_autenticacion_id !== undefined && data.metodo_autenticacion_id !== null) {
            metodoAutenticacion = { connect: { metodo_autenticacion_id: data.metodo_autenticacion_id } };
        }

        const usuariosParametros = await this.prismaService.usuariosParametros.findMany({
            select: { usuario_parametro_id: true }
        });

        usuariosParametros.forEach(parametro => {
            parametrosIds.push({ usuario_parametro_id: parametro.usuario_parametro_id },);
        });

        const user = this.prismaService.usuarios.create({
            data: {
                nombre_usuario: data.nombre_usuario,
                contrasena: await this.hashPassword(contrasena_provisional, salt),
                correo: data.correo,
                salt: salt,
                fecha_vigencia_contrasena: await this.addDaysToDate(new Date(), 90),
                fecha_creacion: new Date(),
                fecha_actualizacion: new Date(),
                TbRoles: { connect: { rol_id: data.rol_id } },
                TbEstadosUsuarios: { connect: { estado_usuario_id: data.estado_usuario_id } },
                TbMetodosAutenticacion: metodoAutenticacion,
                TbTipoUsuarios: { connect: { tipo_usuario_id: data.tipo_usuario_id } },
                sol_cambio_contrasena: true,
                UsuarioParametroValor: {
                    create: parametrosIds
                }
            },
            include: { UsuariosSesionesSec: true, TbEstadosUsuarios: true, TbTipoUsuarios: true, TbRoles: true, TbMetodosAutenticacion: true, UsuarioParametroValor: { include: { UsuariosParametros: true } } }
        })

        if (user === null) {
            throw new UnauthorizedException('El usuario no pudo ser creado');
        }
        try {
            await this.mailerService.sendMail({
                to: data.correo,
                from: process.env.USER_MAILER,
                subject: 'Clave temporal',
                text: 'Clave temporal',
                html: `<b>Usuario: ${data.nombre_usuario} </b>
                <b>Clave temporal: ${contrasena_provisional} </b>`,
            })
        } catch (error) {
            throw new UnauthorizedException("No se puede enviar la clave temporal " + error);
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

        let user0 = await this.getUsuarioByUsername(data.nombre_usuario)
        let numerocontrasenas = await this.getUsuarioParametros(user0.usuario_id, "autnummaxintentos")
        if (!user0.sol_cambio_contrasena) {
            let vencimientocontrasena = await this.getUsuarioParametros(user0.usuario_id, "autvctocontrasena");
            if (vencimientocontrasena.valor == "true") {
                let usuarioparametro = await this.getUsuarioParametros(user0.usuario_id, "autvigenciacontrasena")

                let tiempo = await this.timeCalculateDays(user0);

                if (tiempo >= parseInt(usuarioparametro.valor)) {
                    await this.statusChange(data.nombre_usuario)
                    throw new UnauthorizedException({ error_code: "002", message: "La contraseña ha expirado", data: user0 });
                }
            }

            if (user0.cant_intentos >= numerocontrasenas.valor) {
                throw new UnauthorizedException({ error_code: "003", message: "Bloquedo por intentos fallidos", data: user0 });
            }

        }

        const user = await this.prismaService.usuarios.findFirst({
            where: {
                nombre_usuario: data.nombre_usuario,
                contrasena: await this.hashPassword(data.contrasena, salt.salt)
            },
            include: { UsuariosSesionesSec: true, TbEstadosUsuarios: true, TbTipoUsuarios: true, TbRoles: true, TbMetodosAutenticacion: true, UsuarioParametroValor: { include: { UsuariosParametros: true } } }
        })

        if (!user) {
            if (!user0.sol_cambio_contrasena) {
                await this.addIntentos(data.nombre_usuario)
                if (user0.cant_intentos + 1 >= numerocontrasenas.valor) {
                    await this.statusChange(data.nombre_usuario)
                }
            }
            throw new UnauthorizedException({ error_code: "004", message: "Credenciales inválidas" });
        }

        if (user.sol_cambio_contrasena) {
            throw new UnauthorizedException({ error_code: "001", message: "Usuario nuevo", data: user0 });
        }

        if (user.metodo_autenticacion_id !== null) {
            return user;
        }

        const token = this.jwtService.sign({ userId: user.usuario_id });
        await this.prismaService.usuarios.update({
            where: { usuario_id: user.usuario_id },
            data: {
                cant_intentos: 0,
            }
        })

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

        let user9 = await this.getUsuarioById(data.usuario_id);
        const salt = await this.prismaService.usuarios.findFirst({
            where: { usuario_id: user9.usuario_id },
            select: { salt: true },
        })

        if (salt === null) {
            throw new UnauthorizedException({ error_code: "004", message: "Credenciales inválidas" });
        }
        if (user9.sol_cambio_contrasena) {
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

        await this.ValidationHistoricoContrasenas(data)

        let usuarioparametro = await this.getUsuarioParametros(data.usuario_id, "autvigenciacontrasena")
        let tiempo00 = await this.addDaysToDate(new Date(), parseInt(usuarioparametro.valor))
        let estadoUsuario = await this.getEstadoUsuario("ACTIVO");

        await this.getUsuarioById(data.usuario_id);

        return this.prismaService.usuarios.update({
            where: { usuario_id: data.usuario_id },
            data: {
                contrasena: await this.hashPassword(data.nueva_contrasena, salt.salt),
                estado_usuario_id: estadoUsuario.estado_usuario_id,
                sol_cambio_contrasena: false,
                cant_intentos: 0,
                fecha_vigencia_contrasena: tiempo00,
                UsuariosHistoricoContrasenasSec: {
                    create: {
                        contrasena: await this.hashPassword(data.nueva_contrasena, salt.salt),
                        fecha_actualizacion: new Date()
                    }
                }
            },
            include: { UsuariosSesionesSec: true, TbEstadosUsuarios: true, TbTipoUsuarios: true, TbRoles: true, TbMetodosAutenticacion: true, }
        })
    }

    async ValidationHistoricoContrasenas(data: any) {

        let user = await this.getUsuarioById(data.usuario_id);
        let user1 = await this.getUsuarioByUsername(user.nombre_usuario);
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

        let recoveryCode = this.randomCode().padStart(8, "0");
        let hashRecoveryCode = await bcrypt.hash(recoveryCode, user.salt);
        let parametrovalor = await this.getUsuarioParametros(user.usuario_id, "autcodrestabcontra")
        let parametrovalor1 = await this.getUsuarioParametros(user.usuario_id, "autfecharestabcontra")

        let time1 = Date.parse(parametrovalor1.valor)
        let time2 = new Date(time1)
        let tiempo = await this.timeCalculateSecs(time2);
        if (tiempo <= 60) {
            throw new UnauthorizedException({ error_code: "007", message: "Debe esperar 60 segundos para volver a generar el codigo de verificación" });
        }

        await this.updateUsuarioParametro(user.usuario_id, hashRecoveryCode, parametrovalor.usuario_parametro_valor_id,)
        let updateData = await this.updateUsuarioParametro(user.usuario_id, new Date().toString(), parametrovalor1.usuario_parametro_valor_id,)
        try {
            await this.mailerService.sendMail({
                to: user.correo,
                from: process.env.USER_MAILER,
                subject: 'Código de verificación',
                text: 'Código de verificación',
                html: `<b>Su código de verificación es ${recoveryCode} </b>`,
            })
        } catch (error) {
            throw new UnauthorizedException("No se pudo enviar el có digo de verificación " + error);
        }
        return updateData;
    }

    public async exValidationCodeVerification(data: ValidationCodeVerificationInput): Promise<any> {

        const user0 = await this.getUsuarioById(data.usuario_id)

        let Result = await this.prismaService.usuariosParametrosValores.findFirst({
            where: {
                usuario_id: user0.usuario_id,
                valor: await bcrypt.hash(data.codigo, user0.salt)
            },
        })

        if (Result === null) {
            throw new UnauthorizedException({ error_code: "011", message: "El código es incorrecto, vuelve a intentarlo" });
        }

        return user0;
    }

    public async sendCodeMail(usuario_id: number) {

        let user = await this.getUsuarioById(usuario_id);

        if (user.TbMetodosAutenticacion.nombre !== "EMAIL") {
            throw new UnauthorizedException("El usuario no tiene configurada la doble autenticación con EMAIL");
        }

        let id = await this.getUsuarioParametros(user.usuario_id, "autemailcodrecup")
        let fecha = await this.getUsuarioParametros(user.usuario_id, "autfechacodrecup")

        let validacion = await this.prismaService.usuariosParametrosValores.findFirst({
            where: { usuario_parametro_valor_id: fecha.usuario_parametro_valor_id },
            select: { valor: true }
        })
        let tiempo = await this.timeCalculateSecs(new Date(validacion.valor));
        if (tiempo > 60) {
            let recoveryCode = this.randomCode().padStart(8, "0");
            let hashRecoveryCode = bcrypt.hash(recoveryCode, user.salt);

            this.updateUsuarioParametro(user.usuario_id, await hashRecoveryCode, id.usuario_parametro_valor_id)

            this.updateUsuarioParametro(user.usuario_id, new Date().toString(), fecha.usuario_parametro_valor_id)

            try {
                await this.mailerService.sendMail({
                    to: user.correo,
                    from: process.env.USER_MAILER,
                    subject: 'Código de verificación',
                    text: 'Código de verificación',
                    html: `<b>Su código de verificación es ${recoveryCode} </b>`,
                })
            } catch (error) {
                throw new UnauthorizedException("No se pudo enviar el código de verificación " + error);
            }
            return user;
        }
        else throw new UnauthorizedException({ error_code: "007", message: "Debe esperar 60 segundos para volver a generar el codigo de verificación" });
    }

    public async validationCodeMail(data: ValidationCodeMailInput): Promise<any> {

        let user = await this.getUsuarioById(data.usuario_id);

        let id = await this.getUsuarioParametros(user.usuario_id, "autemailcodrecup")
        let fecha = await this.getUsuarioParametros(user.usuario_id, "autfechacodrecup")

        let variable = await this.prismaService.usuariosParametrosValores.findFirst({
            where: { usuario_parametro_valor_id: fecha.usuario_parametro_valor_id },
            select: { valor: true }
        })
        let tiempo = await this.timeCalculateSecs(variable.valor);
        if (tiempo > (15 * 60)) {
            throw new UnauthorizedException({ error_code: "013", message: "El código expiró, recuerde que la vigencia del código es de 15 minutos" });
        }

        let validacion = await this.prismaService.usuariosParametrosValores.findFirst({
            where: {
                usuario_parametro_valor_id: id.usuario_parametro_valor_id,
                valor: await bcrypt.hash(data.codigo, user.salt)
            },
        })
        if (validacion === null) {
            throw new UnauthorizedException({ error_code: "011", message: "El código es incorrecto, vuelve a intentarlo" });
        }
        return user;
    }

    async configTotp(usuario_id: number): Promise<any> {

        let user = await this.getUsuarioById(usuario_id);

        if (user.TbMetodosAutenticacion.nombre !== "TOTP") {
            throw new UnauthorizedException("El usuario no tiene configurada la doble autenticación con TOTP");
        }

        let configuracion_TOTP = await this.getUsuarioParametros(usuario_id, "auttotpconfig")
        let otplib_secreta = await this.getUsuarioParametros(usuario_id, "auttotplibsecreta")

        let configuracion = await this.prismaService.usuariosParametrosValores.findFirst({
            where: { usuario_parametro_valor_id: configuracion_TOTP.usuario_parametro_valor_id },
            select: { valor: true }
        })

        if (configuracion.valor == "false") {

            const { otpauthUrl, secret } = await this.generateAuthenticationSecret(usuario_id);
            const qrCodeUrl = this.buildQrCodeUrl(otpauthUrl);

            let totp = this.prismaService.usuariosParametrosValores.update({
                where: { usuario_parametro_valor_id: otplib_secreta.usuario_parametro_valor_id },
                data: {
                    valor: secret
                }
            })

            return Object.assign(totp, { qr_code: JSON.stringify(qrCodeUrl) });
        }
        return Object.assign(user, { qr_code: "" });
    }

    async exSetActivateConfigTotp(usuario_id: number): Promise<any> {

        let user = await this.getUsuarioById(usuario_id);
        if (user.TbMetodosAutenticacion.nombre !== "TOTP") {
            throw new UnauthorizedException("El usuario no tiene configurada la doble autenticación con TOTP");
        }

        try {
            let recoveryCode = this.generateRecoveryCode(20);
            try {
                await this.mailerService.sendMail({
                    to: user.correo,
                    from: process.env.USER_MAILER,
                    subject: 'Código de activación',
                    text: 'Código de activación',
                    html: `<b>Su código de activación para el metodo de autenticación TOTP es ${recoveryCode} </b>`,
                })

                let usuario_parametro_config = await this.getUsuarioParametros(usuario_id, "auttotpconfig")
                let usuario_parametro_codigo = await this.getUsuarioParametros(usuario_id, "auttotpcodrecup")

                this.updateUsuarioParametro(usuario_id, "true", usuario_parametro_config.usuario_parametro_valor_id)

                this.updateUsuarioParametro(usuario_id, recoveryCode, usuario_parametro_codigo.usuario_parametro_valor_id)

            } catch (error) {
                throw new UnauthorizedException("No se puedo enviar el código de activación " + error);
            }

            return user
        } catch (error) {
            console.log(error)
            throw new UnauthorizedException("No se pudo generar el código de recuperación");
        }
    }

    public async exValidateTotpCode(data: DoblesFactoresValidarInput) {

        let user = await this.getUsuarioById(data.usuario_id);
        let ss = await this.getUsuarioParametros(data.usuario_id, "auttotpcodrecup")

        let secret_code = await this.prismaService.usuariosParametrosValores.findFirst({
            where: { usuario_parametro_valor_id: ss.usuario_parametro_valor_id },
            select: { valor: true }
        })

        authenticator.verify({
            token: data.codigo,
            secret: secret_code.valor
        })
        return user
    }

    async exValidateRecoveryCode(data: CodigoRecuperacionInput): Promise<any> {
        let user = await this.getUsuarioById(data.usuario_id);

        let usuario_parametro_config = await this.getUsuarioParametros(data.usuario_id, "auttotpconfig")

        if (user) {
            await this.prismaService.usuarios.update({
                where: { usuario_id: user.usuario_id },
                data: {
                    UsuarioParametroValor: {
                        update: {
                            where: {
                                usuario_parametro_valor_id: usuario_parametro_config.usuario_parametro_valor_id
                            },
                            data: {
                                valor: "false"
                            }
                        }
                    }
                }
            })
        }
        if (user !== null) {
            return user;
        } else {
            throw new UnauthorizedException("Invalid recovery code");
        }
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
            include: { UsuariosSesionesSec: true, TbEstadosUsuarios: true, TbTipoUsuarios: true, TbRoles: true, TbMetodosAutenticacion: true, }
        })
    }

    public async updateUsuarioParametro(usuario_id: number, valor: string, usuario_parametro_valor_id: number) {

        return this.prismaService.usuarios.update({
            where: { usuario_id: usuario_id },
            include: { UsuarioParametroValor: true },
            data: {
                UsuarioParametroValor: {
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

        if (parametrovalor.valor == null) {
            Object.assign(parametrovalor, { valor: usuarioparametro.valor_defecto });
            if (parametrovalor.valor === null) {
                throw new UnauthorizedException(`El parámetro ${alias} no está configurado`);
            }
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

    randomCode(): string {
        let min = 0;
        let max = 9999999999;
        let Code = Math.floor(Math.random() * (max - min)) + min;
        return Code.toString();
    }

    createRandomPassword(): string {
        return Math.random().toString(36).slice(-8);
    }

    async addIntentos(nombre_usuario) {

        const user0 = await this.getUsuarioByUsername(nombre_usuario)
        await this.prismaService.usuarios.update({
            where: { usuario_id: user0.usuario_id },
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

        const user0 = await this.getUsuarioByUsername(nombre_usuario);
        let estadoUsuario = await this.getEstadoUsuario("BLOQUEADO");

        await this.prismaService.usuarios.update({
            where: { usuario_id: user0.usuario_id },
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

    public async timeCalculateSecs(data) {
        let date1 = new Date(data);
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
        const otpauthUrl = authenticator.keyuri(user.email, "Maia ERP", secret);
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
}
