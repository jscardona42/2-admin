import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from "@nestjs/jwt";
import { Menu } from './menu.entity';


@Injectable()
export class MenuService {
    constructor(private prismaService: PrismaService, private jwtService: JwtService) { }

    async findAllMenus() {
        return this.prismaService.menus.findMany();
    }

    async getMenuRole(role_id): Promise<Menu[]> {
        var rolePermissions = await this.prismaService.roles_permissions.findFirst({
            where: { role_id: role_id }
        })

        var permissions = JSON.parse(rolePermissions.permissions);

        return await this.prismaService.menus.findMany({
            where: { permission: { in: permissions } },
            orderBy: { id: "asc" }
        })
    }

}
