import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { RolesService } from '../Admin/Roles/roles.service';
import { Usuarios } from './entities/usuarios.entity';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { AuditoriasService } from '../Auditorias/auditorias.service';
import { AuthenticationError } from 'apollo-server-express';
import { ChangePasswordInput, SignUpUserInput } from './dto/usuarios.dto';


@Injectable()
export class UsuariosService {
    constructor(
        private prismaService: PrismaService,
        private rolesService: RolesService,
        private jwtService: JwtService,
        private auditService: AuditoriasService,
    ) { }

    async getUsuarios(): Promise<Usuarios[]> {
        return this.prismaService.usuarios.findMany({
            include: { DoblesFactores: true }
        });
    }

    async getUsuarioById(usuario_id: number): Promise<Usuarios> {
        var usuarios = await this.prismaService.usuarios.findUnique({
            where: { usuario_id: usuario_id },
            include: { DoblesFactores: true }
        })

        if (usuarios === null) {
            throw new UnauthorizedException(`El usuario con id ${usuario_id} no existe`);
        }

        return usuarios;
    }

    async getFilterUsuarios(nombre: string, email: string): Promise<Usuarios[]> {
        return this.prismaService.usuarios.findMany({
            where: { OR: [{ nombre: { contains: nombre, mode: "insensitive" } }, { email: { contains: email, mode: "insensitive" } }] }
        })
    }

    async signUpLogin(data: SignUpUserInput): Promise<Usuarios> {

        await this.rolesService.getRolById(data.rol_id);
        const salt = await bcrypt.genSalt();
        const usernameExists = await this.usernameExists(data.username);

        if (usernameExists) {
            throw new UnauthorizedException('El usuario ya se encuentra registrado');
        }

        const user = this.prismaService.usuarios.create({
            data: {
                nombre: data.nombre,
                email: data.email,
                username: data.username,
                password: await this.hashPassword(data.password, salt),
                salt: salt,
                Roles: { connect: { rol_id: data.rol_id } }
            },
            include: { DoblesFactores: true }
        })

        if (user === null) {
            throw new UnauthorizedException('El usuario no pudo ser creado');
        }
        return user;
    }

    async signInLogin(data: any): Promise<Usuarios> {
        const salt = await this.prismaService.usuarios.findFirst({
            where: { username: data.username },
            select: { salt: true },
        })

        if (salt === null) {
            this.auditService.registerAuditoria(data);
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const user = await this.prismaService.usuarios.findFirst({
            where: {
                username: data.username,
                password: await this.hashPassword(data.password, salt.salt)
            },
            include: { DoblesFactores: true }
        })

        if (!user) {
            this.auditService.registerAuditoria(data);
            throw new UnauthorizedException('Credenciales inválidas');
        }

        this.auditService.registerAuditoria(user);

        const token = this.jwtService.sign({ userId: user.usuario_id });
        return this.createToken(token, user);
    }

    async logOutLogin(usuario_id) {
        return this.prismaService.usuarios.update({
            where: { usuario_id: usuario_id },
            data: { token: null }
        })
    }

    async exChangePasswordLogin(data: ChangePasswordInput): Promise<Usuarios> {

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
                password: await this.hashPassword(data.password, salt.salt)
            },
        })

        if (login === null) {
            throw new AuthenticationError('Invalid credentials');
        }

        const new_salt = await bcrypt.genSalt();

        const user = await this.prismaService.usuarios.update({
            where: { usuario_id: data.usuario_id },
            data: {
                password: await this.hashPassword(data.new_password, new_salt),
                salt: new_salt,
            },
            include: { DoblesFactores: true }
        })

        if (user === null) {
            throw new UnauthorizedException('User does not exist');
        }

        return user;
    }

    async usernameExists(username): Promise<Boolean> {
        const user = await this.prismaService.usuarios.findFirst({
            where: { username: username },
            select: { username: true }
        })

        if (user === null) {
            return false;
        } else {
            return true;
        }
    }

    async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

    async createToken(token: string, user): Promise<Usuarios> {
        return this.prismaService.usuarios.update({
            where: { usuario_id: user.usuario_id, },
            data: { token: token, },
            include: { DoblesFactores: true }
        })
    }

}