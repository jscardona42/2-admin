
import { CanActivate, Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import * as jwt from 'jsonwebtoken'
import { Reflector } from '@nestjs/core';
import { PrismaService } from "../prisma.service";

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {

    constructor(private reflector: Reflector, private prismaService: PrismaService) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<any> {
        // try {
        const ctx = GqlExecutionContext.create(context);
        const req = ctx.getContext().req;

        console.log(req);

        var tkn = req.headers.authorization.split(' ')[1];

        

        var token = jwt.verify(tkn, 'topSecret');

        let _class = context.getClass().name;
        let permissionsReq = context.getHandler().name;

        const permissions = JSON.parse(await this.getPermissions(token));

        const perExists = permissions.filter(permiss => permiss === permissionsReq);

        const user = await this.validate(token, tkn);

        

        if (user == null || token == null || perExists.length === 0) {
            throw new UnauthorizedException("Usuario no autorizado");
        }
        return true;

        // } catch (error) {
        //     throw new UnauthorizedException("Usuario no autorizado 3");
        // }
    }

    async getPermissions(token) {
        const rolePermissions = await this.prismaService.roles_permissions.findFirst({
            where: { role_id: token.role },
        });
        return rolePermissions.permissions;
    }

    async validate(token: any, tkn: any) {
        const user = await this.prismaService.user.findFirst(
            { where: { id: token.userId, token: tkn } }
        )
        // if (!user) {
        //     throw new UnauthorizedException("El usuario no existe o el token es incorrecto")
        // }
        return user;
    }
}
