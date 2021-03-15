import { Injectable } from "@nestjs/common";
import { json } from "express";
import { cloneSchema } from "graphql-tools";
import { PrismaService } from "../prisma.service";
import { Permissions } from "./permission.entity";
import { Role } from "./role.entity";
import { RolesPermissions } from "./rolepermission.entity";

@Injectable()
export class AdminService {
    constructor(private prismaService: PrismaService) {

    }

    async getAllMethods(): Promise<Permissions[]> {
        return this.prismaService.permissions.findMany({});
    }

    async getAllRoles(): Promise<Role[]> {
        return this.prismaService.roles.findMany();
    }

    getMethods(cls: any) {
        var TMPmethods = Object.getOwnPropertyNames(cls.prototype).filter(
            item => item !== 'constructor'
        );

        var nameMethods = [{ nameClass: cls.name, methods: TMPmethods }];
        var nameMethods1 = nameMethods.filter(method => !method.nameClass.includes("Service"));

        if (nameMethods1.length > 0) {
            this.createMethods(nameMethods1[0])
        }
        // return JSON.stringify(nameMethods);
    }

    async createMethods(cls) {
        const moduleData = await this.prismaService.permissions.findFirst({
            where: {
                name: cls.nameClass,
            },
        })

        if (moduleData) {
            return this.prismaService.permissions.update({
                where: { id: moduleData.id },
                data: { methodclass: JSON.stringify(cls.methods) }
            });
        } else {
            return this.prismaService.permissions.create({
                data: { name: cls.nameClass, methodclass: JSON.stringify(cls.methods) }
            });
        }
    }

    async getAllRolesPermissions(): Promise<RolesPermissions[]> {
        return this.prismaService.roles_permissions.findMany({});
    }
}