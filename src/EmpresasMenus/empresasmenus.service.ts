import { MenuPersonalizado } from '.prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RolesPermisosService } from 'src/Admin/RolesPermisos/rolespermisos.service';
import { LoginService } from 'src/Login/login.service';
import { MenusService } from 'src/Menus/menus.service';
import { UsuariosService } from 'src/Usuarios/usuarios.service';
import { PrismaService } from '../prisma.service';
import { UpdateMenuPersonalizadoInput } from './dto/menupersonalizado.dto';
import { EmpresasMenus } from './entities/empresasmenus.entity';

@Injectable()
export class EmpresasMenusService {
    constructor(
        private prismaService: PrismaService,
        private rolesPermisosService: RolesPermisosService,
        private loginService: LoginService,
        private usuariosService: UsuariosService,
        private menusService: MenusService
    ) { }

    async getEmpresasMenus(): Promise<Object[]> {
        return await this.prismaService.empresasMenus.findMany({
            include: { Empresas: true, Menus: { include: { Menus: true } } }
        })
    }

    async getEmpresaMenuByEmpresaId(login_id: number): Promise<MenuPersonalizado> {
        var arrayMenuIds = [];

        var login = await this.loginService.getLoginById(login_id);
        var usuario = await this.usuariosService.getUsuarioById(login.usuario_id);

        var menuIds = await this.prismaService.empresasMenus.findMany({
            where: { empresa_id: usuario.empresa_id },
            select: { menu_id: true }
        })

        if (menuIds === null) {
            throw new UnauthorizedException("The company does not have a menu configured");
        }

        menuIds.forEach(function (menu, index) {
            arrayMenuIds[index] = menu.menu_id;
        });

        const OR = [{ menu_id: { in: arrayMenuIds }, }];
        const AND = [];

        var menuEmpresa = await this.menusService.getFilterMenu(OR, AND, 0);

        var menuPersonalizado = await this.prismaService.menuPersonalizado.findFirst({
            where: { empresa_id: usuario.empresa_id }
        })

        if (menuPersonalizado === null) {
            return await this.prismaService.menuPersonalizado.create({
                data: { menu: menuEmpresa[0], empresa_id: usuario.empresa_id }
            })
        }
        return this.prismaService.menuPersonalizado.findUnique({
            where: { menu_pesonalizado_id: menuPersonalizado.menu_pesonalizado_id }
        })
    }

    async updateMenuPersonalizado(data: UpdateMenuPersonalizadoInput): Promise<MenuPersonalizado> {

        var menuPersonalizado = await this.prismaService.menuPersonalizado.findFirst({
            where: { empresa_id: data.empresa_id },
            select: { menu_pesonalizado_id: true }
        })

        if (menuPersonalizado === null) {
            throw new UnauthorizedException("The company does not have a menu configured");
        }

        return this.prismaService.menuPersonalizado.update({
            where: { menu_pesonalizado_id: menuPersonalizado.menu_pesonalizado_id },
            data: { menu: data.menu[0] }
        })
    }

    async getEmpresaMenuByRoleId(login_id: number, traduccion_id: number): Promise<any> {
        var arrayMenuIds = [];
        var arrayEntidadIds = [];

        var login = await this.loginService.getLoginById(login_id);
        var usuario = await this.usuariosService.getUsuarioById(login.usuario_id);

        if (usuario === null) {
            throw new UnauthorizedException("The company does not have a menu configured");
        }
        var entidadIds = await this.rolesPermisosService.getEntidadesIdsByRolId(login.rol_id);

        var menuIds = await this.prismaService.empresasMenus.findMany({
            where: { empresa_id: usuario.empresa_id },
            select: { menu_id: true }
        })

        menuIds.forEach(function (menu, index) {
            arrayMenuIds[index] = menu.menu_id;
        });

        entidadIds.forEach(function (permiso, index) {
            arrayEntidadIds[index] = permiso.Permisos;
        });

        arrayEntidadIds.forEach(function (entidad, index) {
            arrayEntidadIds[index] = entidad.entidad_id;
        });

        const OR = [{ entidad_id: { in: arrayEntidadIds }, }, { isEntity: false },];
        const AND = [{ menu_id: { in: arrayMenuIds } }];

        var menuEmpresa = await this.menusService.getFilterMenu(OR, AND, traduccion_id);

        return menuEmpresa;
    }

}
