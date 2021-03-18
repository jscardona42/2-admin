import { Args, Context, Mutation, Query, ResolveField, Resolver, Root } from "@nestjs/graphql";
import { PrismaService } from "../prisma.service"
import { Inject, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { GqlAuthGuard } from "./authguard.guard";
import { AdminService } from "../admin/admin.service";
import { Permissions } from "./permission.entity";
import { Role } from "./role.entity";
import { RolesPermissions } from "./rolepermission.entity";


@Resolver(of => Permissions)
export class AdminResolver {

    constructor(@Inject(PrismaService) private prismaService: PrismaService, private jwtService: JwtService, private adminService: AdminService) { }

    @Query(returns => [Permissions])
    async getAllMethods(): Promise<Permissions[]> {
        return this.adminService.getAllMethods();
    }

    @Query(returns => [Role], { name: "roles", description: "It returns all registered roles" })
    async getAllRoles(): Promise<Role[]> {
        return this.adminService.getAllRoles();
    }

    @Query(returns => [RolesPermissions], { name: "rolesPermissions", description: "It returns all registered roles_Permissions" })
    async getAllRolesPermissions(): Promise<RolesPermissions[]> {
        return this.adminService.getAllRolesPermissions();
    }

}
