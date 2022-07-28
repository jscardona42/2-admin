import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { AuthenticationError } from 'apollo-server-express';
import { TbRolesService } from '../GestionFuncionalidades/Roles/roles.service';
import { ChangePasswordInput, SignUpUserInput } from './dto/usuarios.dto';


@Injectable()
export class UsuariosService {
    constructor(
        private prismaService: PrismaService,
        private Roles: TbRolesService,
        private jwtService: JwtService,
    ) { }

    async getUsuarios(): Promise<any>{
        return this.prismaService.usuarios.findMany({
            include:{ UsuariosSesionesSec: true }
        });
    }

    async getUsuarioById(usuario_id: number): Promise<any> {
        let usuarios = await this.prismaService.usuarios.findUnique({
            where: { usuario_id: usuario_id },
            include: { UsuariosSesionesSec: true, TbEstadosUsuarios: true, TbTipoUsuarios: true, TbRoles: true, TbMetodosAutenticacion: true,  }
        })

        if (usuarios === null) {
            throw new UnauthorizedException(`El usuario con id ${usuario_id} no existe`);
        }

        return usuarios;
    }

    async getFilterUsuarios(nombre_usuario: string, correo: string): Promise<any> {
        return this.prismaService.usuarios.findMany({
            where: { 
                OR: 
            [
                { nombre_usuario: { contains: nombre_usuario, mode: "insensitive" } },
                { correo: { contains: correo, mode: "insensitive" } }
            ]}
        })
    }

    async signUpLogin(data: SignUpUserInput): Promise<any> {

        await this.Roles.getRolById(data.rol_id);
        const salt = await bcrypt.genSalt();
        const usernameExists = await this.usernameExists(data.nombre_usuario);
        if (usernameExists) {
            throw new UnauthorizedException('El usuario ya se encuentra registrado');
        }

        const user = this.prismaService.usuarios.create({
            data: {
                nombre_usuario: data.nombre_usuario,
                contrasena: await this.hashPassword(data.contrasena, salt),
                correo: data.correo,
                salt: salt,
                fecha_vigencia_contrasena: new Date(),
                fecha_creacion: new Date(),
                fecha_actualizacion: new Date(),
                TbRoles: { connect: { rol_id: data.rol_id } },
                TbEstadosUsuarios: { connect:{ estado_usuario_id: data.estado_usuario_id}},
                TbMetodosAutenticacion: { connect:{ metodo_autenticacion_id: data.metodo_autenticacion_id}},
                TbTipoUsuarios: { connect:{ tipo_usuario_id: data.tipo_usuario_id}},
            },
            include: { UsuariosSesionesSec: true, TbEstadosUsuarios: true, TbTipoUsuarios: true, TbRoles: true, TbMetodosAutenticacion: true,  }
        })

        if (user === null) {
            throw new UnauthorizedException('El usuario no pudo ser creado');
        }
        return user;
    }

    async signInLogin(data: any): Promise<any> {
        const salt = await this.prismaService.usuarios.findFirst({
            where: { nombre_usuario: data.nombre_usuario },
            select: { salt: true },
        })

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
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const token = this.jwtService.sign({ userId: user.usuario_id });
        return this.createToken(token, user);
    }

    async logOutLogin(usuario_id) {
        return this.prismaService.usuarios.update({
            where: { usuario_id: usuario_id },
            data: {  }
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
            include: { UsuariosSesionesSec: true, TbEstadosUsuarios: true, TbTipoUsuarios: true, TbRoles: true, TbMetodosAutenticacion: true,  }
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
            data: { UsuariosSesionesSec:{
                upsert:{
                    create:{
                        token: token,
                        fecha_ultimo_login: new Date()
                        
                    },
                    update:{
                        token: token,
                        fecha_ultimo_login: new Date()
                    }
                }
            } },
            include: { UsuariosSesionesSec: true, TbEstadosUsuarios: true, TbTipoUsuarios: true, TbRoles: true, TbMetodosAutenticacion: true,  }
        })
    }

}