import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { AuthenticationError } from 'apollo-server-express';
import { TbRolesService } from '../GestionFuncionalidades/Roles/roles.service';
import { ChangePasswordInput, SendCodeVerificationInput, SignUpUserInput, ValidationCodeVerificationInput } from './dto/usuarios.dto';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class UsuariosService {
    constructor(
        private prismaService: PrismaService,
        private Roles: TbRolesService,
        private mailerService: MailerService,
        private jwtService: JwtService,
    ) { }

    async getUsuarios(): Promise<any> {
        return this.prismaService.usuarios.findMany({
            include: { UsuariosSesionesSec: true }
        });
    }

    async getUsuarioById(usuario_id: number): Promise<any> {
        let usuarios = await this.prismaService.usuarios.findUnique({
            where: { usuario_id: usuario_id },
            include: { UsuariosSesionesSec: true, TbEstadosUsuarios: true, TbTipoUsuarios: true, TbRoles: true, TbMetodosAutenticacion: true, }
        })

        if (usuarios === null) {
            throw new UnauthorizedException(`El usuario con id ${usuario_id} no existe`);
        }

        return usuarios;
    }

    async getUsuarioByUsername(nombre_usuario: string): Promise<any> {
        let user = await this.prismaService.usuarios.findFirst({
            where: { nombre_usuario: nombre_usuario },
            include: { UsuarioParametroValor: true, TbEstadosUsuarios: true, TbMetodosAutenticacion: true, TbRoles: true, TbTipoUsuarios: true, UsuariosHistoricoContrasenasSec: true, UsuariosSesionesSec: true }
        })

        if (user === null) {
            throw new UnauthorizedException(`El usuario con id ${nombre_usuario} no existe`);
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

        await this.Roles.getRolById(data.rol_id);
        const salt = await bcrypt.genSalt();
        const usernameExists = await this.usernameExists(data.nombre_usuario);
        if (usernameExists) {
            throw new UnauthorizedException('El usuario ya se encuentra registrado');
        }
        let contrasena_provisional = this.createRandomPassword();
        
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
                TbMetodosAutenticacion: { connect: { metodo_autenticacion_id: data.metodo_autenticacion_id } },
                TbTipoUsuarios: { connect: { tipo_usuario_id: data.tipo_usuario_id } },
                sol_cambio_contrasena: true,
            },
            include: { UsuariosSesionesSec: true, TbEstadosUsuarios: true, TbTipoUsuarios: true, TbRoles: true, TbMetodosAutenticacion: true, }
        })

        if (user === null) {
            throw new UnauthorizedException('El usuario no pudo ser creado');
        }
        try {
            await this.mailerService.sendMail({
                to: data.correo,
                from: process.env.USER_MAILER,
                subject: 'Código de recuperacionn',
                text: 'Código de recuperacionn',
                html: `<b>Su código de recuperacionn es ${contrasena_provisional} </b>`,
            })
        } catch (error) {
            throw new UnauthorizedException("Unable to send verification code " + error);
        }

        return user;
    }

    async signInLogin(data: any): Promise<any> {

        const salt = await this.prismaService.usuarios.findFirst({
            where: { nombre_usuario: data.nombre_usuario },
            select: { salt: true, cant_intentos: true, },
        })

        const user0 = await this.getUsuarioByUsername(data.nombre_usuario)

        let usuarioparametro = await this.prismaService.usuariosParametros.findFirst({
            where: { alias: "autvigenciacontrasena" },
            select: { usuario_parametro_id: true }
        })
        let parametrovalor = await this.prismaService.usuariosParametrosValores.findFirst({
            where: { usuario_parametro_id: usuarioparametro.usuario_parametro_id, usuario_id: user0.usuario_id },
            select: { usuario_parametro_valor_id: true, valor: true }
        })

        let tiempo = await this.timeCalculate(user0);

        if (tiempo >= parametrovalor.valor) {
            await this.cambioEstado(data.nombre_usuario)
            throw new UnauthorizedException('El limite de tiempo de vigencia de la contrasena ha caducado');
        }

        if (user0.cant_intentos >= process.env.INTENTOS) {
            throw new UnauthorizedException('Cantidad de intentos superada, restablezca su contrasena');
        }

        if (salt === null) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const user = await this.prismaService.usuarios.findFirst({
            where: {
                nombre_usuario: data.nombre_usuario,
                contrasena: await this.hashPassword(data.contrasena, salt.salt)
            },
            include: { UsuariosSesionesSec: true, TbEstadosUsuarios: true, TbTipoUsuarios: true, TbRoles: true, TbMetodosAutenticacion: true }
        })

        if (!user) {
            await this.aumentoIntentos(data.nombre_usuario)
            if (user0.cant_intentos + 1 == process.env.INTENTOS) {
                await this.cambioEstado(data.nombre_usuario)
            }
            throw new UnauthorizedException('Credenciales inválidas');
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

    async logOutLogin(usuario_id) {
        return this.prismaService.usuarios.update({
            where: { usuario_id: usuario_id },
            data: {}
        })
    }

    async exChangePasswordLogin(data: ChangePasswordInput): Promise<any> {

        await this.getUsuarioById(data.usuario_id);

        const salt = await this.prismaService.usuarios.findFirst({
            where: { usuario_id: data.usuario_id },
            select: { salt: true },
        })
        
        if (salt === null) {
            throw new AuthenticationError('Invalid credentials');
        }

        const login = await this.prismaService.usuarios.findFirst({
            where: {
                contrasena: await this.hashPassword(data.contrasena, salt.salt)
            },
        })

        if (login === null) {
            throw new AuthenticationError('Invalid credentials');
        }

        const new_salt = await bcrypt.genSalt();

        const user = await this.prismaService.usuarios.update({
            where: { usuario_id: data.usuario_id },
            data: {
                contrasena: await this.hashPassword(data.nueva_contrasena, new_salt),
                salt: new_salt,
            },
            include: { UsuariosSesionesSec: true, TbEstadosUsuarios: true, TbTipoUsuarios: true, TbRoles: true, TbMetodosAutenticacion: true, }
        })

        if (user === null) {
            throw new UnauthorizedException('User does not exist');
        }

        return user;
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

    codeForgetPassword(): string {
        let min = 0;
        let max = 9999999999;
        let Code = Math.floor(Math.random() * (max - min)) + min;
        return Code.toString();
    }

    createRandomPassword(): string {
        return Math.random().toString(36).slice(-8);
    }

    public async exSendCodeVerification(data: SendCodeVerificationInput) {
        const usernameExists = await this.usernameExists(data.nombre_usuario);
        if (!usernameExists) {
            throw new UnauthorizedException('El usuario no existe');
        }

        const user = await this.getUsuarioByUsername(data.nombre_usuario)

        let recoveryCode = this.codeForgetPassword().padStart(8, "0");
        let hashRecoveryCode = bcrypt.hash(recoveryCode, user.salt);
        let usuarioparametro = await this.prismaService.usuariosParametros.findFirst({
            where: { alias: "codigo" },
            select: { usuario_parametro_id: true }
        })
        let parametrovalor = await this.prismaService.usuariosParametrosValores.findFirst({
            where: { usuario_parametro_id: usuarioparametro.usuario_parametro_id, usuario_id: user.usuario_id },
            select: { usuario_parametro_valor_id: true }
        })

        let data1 = await this.prismaService.usuarios.update({
            where: { usuario_id: user.usuario_id },
            include: { UsuarioParametroValor: true },
            data: {
                UsuarioParametroValor: {
                    update: {
                        where: { usuario_parametro_valor_id: parametrovalor.usuario_parametro_valor_id },
                        data: {
                            valor: await hashRecoveryCode
                        }
                    }
                }
            }
        });
        try {
            await this.mailerService.sendMail({
                to: user.correo,
                from: process.env.USER_MAILER,
                subject: 'Código de recuperacionn',
                text: 'Código de recuperacionn',
                html: `<b>Su código de recuperacionn es ${recoveryCode} </b>`,
            })
        } catch (error) {
            throw new UnauthorizedException("Unable to send verification code " + error);
        }
        return data1;
    }

    public async exValidationCodeVerification(data: ValidationCodeVerificationInput): Promise<any> {

        const user = await this.getUsuarioByUsername(data.nombre_usuario)

        let Result = await this.prismaService.usuariosParametrosValores.findFirst({
            where: {
                valor: await bcrypt.hash(data.codigo, user.salt)
            },
        })

        if (Result === null) {
            throw new UnauthorizedException("Incorrect validation code");
        }

        await this.prismaService.usuarios.update({
            where: { usuario_id: user.usuario_id },
            data: {
                cant_intentos: 0,
                estado_usuario_id: { set: 1 }
            }
        })
        return user;
    }
    async aumentoIntentos(data) {

        const user0 = await this.getUsuarioByUsername(data)
        await this.prismaService.usuarios.update({
            where: { usuario_id: user0.usuario_id },
            data: {
                cant_intentos: { increment: 1 }
            }
        })
    }

    async cambioEstado(data) {

        const user0 = await this.getUsuarioByUsername(data)
        await this.prismaService.usuarios.update({
            where: { usuario_id: user0.usuario_id },
            data: {
                estado_usuario_id: { set: 2 }
            }
        })
    }

    public async timeCalculate(user) {
        let date1 = new Date(user.fecha_creacion);
        let date2 = new Date();
        let time = date2.getTime() - date1.getTime();
        let tiempo = time / (86400000);
        return tiempo.toString()
    }

    public async addDaysToDate(date, days){
        let res = new Date(date);
        res.setDate(res.getDate() + days);
        return res;
    }
}
