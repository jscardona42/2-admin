import { Test } from '@nestjs/testing';
import { MenusService } from '../Menus/menus.service';
import { TraduccionesService } from '../Traducciones/traducciones.service';
import { PrismaService } from '../../prisma.service';
import { MenusTraduccionesService } from './menustraducciones.service';
import { RolesPermisosService } from '../Admin/RolesPermisos/rolespermisos.service';
import { LoginService } from '../Login/login.service';
import { UsuariosService } from '../Usuarios/usuarios.service';
import { EntidadesService } from '../Admin/Entidades/entidades.service';
import { RolesService } from '../Admin/Roles/roles.service';
import { PermisosService } from '../Admin/Permisos/permisos.service';
import { JwtModule } from '@nestjs/jwt';
import { AuditoriasService } from '../Auditorias/auditorias.service';
import { ValidacionesService } from '../Admin/Validaciones/validaciones.service';

describe('MenusTraducciones Service', () => {
    let menusTraduccionesService: MenusTraduccionesService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [
                JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: {
                        expiresIn: process.env.JWT_EXPIRESIN
                    }
                }),
            ],
            providers: [
                MenusTraduccionesService, TraduccionesService, MenusService, RolesPermisosService, LoginService, UsuariosService, EntidadesService, RolesService, PermisosService, AuditoriasService, ValidacionesService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        menusTraducciones: {
                            findFirst: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                        menus: {
                            findUnique: jest.fn(() => { return { menu_id: 1 } }),
                        },
                        traducciones: {
                            findUnique: jest.fn(() => { return { traduccion_id: 1 } }),
                        },
                    }),
                },
            ],
        }).compile();

        menusTraduccionesService = module.get<MenusTraduccionesService>(MenusTraduccionesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getMenusTraducciones method', () => {
        it('should invoke prismaService.menusTraducciones.findMany', async () => {
            await menusTraduccionesService.getMenusTraducciones();
            expect(prismaService.menusTraducciones.findMany).toHaveBeenCalled();
        });
    });

    describe('getMenuTraduccionById method', () => {
        it('should invoke prismaService.menusTraducciones.findUnique', async () => {
            const testParams = {
                menu_traduccion_id: 1
            };
            await menusTraduccionesService.getMenuTraduccionById(
                testParams.menu_traduccion_id
            );
            expect(prismaService.menusTraducciones.findUnique).toHaveBeenCalled();
        });
    });

    describe('createMenuTraduccion method', () => {
        it('should invoke prismaService.menusTraducciones.create', async () => {
            const testParams = {
                data: {
                    traduccion_id: 1,
                    traduccion: "Traducción",
                    menu_id: 1
                }
            };
            await menusTraduccionesService.createMenuTraduccion(
                testParams.data,
            );
            expect(prismaService.menusTraducciones.create).toHaveBeenCalled();
        });
    });

    describe('updateMenuTraduccion method', () => {
        it('should invoke prismaService.menusTraducciones.update', async () => {
            const testParams = {
                data: {
                    menu_traduccion_id: 1,
                    traduccion_id: 1,
                    traduccion: "Traducción",
                    menu_id: 1
                }
            };
            await menusTraduccionesService.updateMenuTraduccion(
                testParams.data
            );
            expect(prismaService.menusTraducciones.update).toHaveBeenCalled();
        });
    });

    describe('deleteMenuTraduccion method', () => {
        it('should invoke prismaService.menusTraducciones.delete', async () => {
            const testParams = {
                menu_traduccion_id: 2
            };
            await menusTraduccionesService.deleteMenuTraduccion(
                testParams.menu_traduccion_id
            );
            expect(prismaService.menusTraducciones.delete).toHaveBeenCalled();
        });
    });
});
