import { Test } from '@nestjs/testing';
import { LoginService } from '../Login/login.service';
import { RolesPermisosService } from '../Admin/RolesPermisos/rolespermisos.service';
import { MenusService } from '../Menus/menus.service';
import { PrismaService } from '../prisma.service';
import { MenusPalabrasService } from './menuspalabras.service';
import { UsuariosService } from '../Usuarios/usuarios.service';
import { EntidadesService } from '../Admin/Entidades/entidades.service';
import { RolesService } from '../Admin/Roles/roles.service';
import { PermisosService } from '../Admin/Permisos/permisos.service';
import { JwtModule } from '@nestjs/jwt';
import { AuditoriasService } from '../Auditorias/auditorias.service';
import { ValidacionesService } from '../Admin/Validaciones/validaciones.service';

describe('MenusPalabras Service', () => {
    let menusPalabrasService: MenusPalabrasService;
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
                MenusPalabrasService, MenusService, RolesPermisosService, LoginService, UsuariosService, EntidadesService, RolesService, PermisosService, AuditoriasService, ValidacionesService,
                {
                    provide: PrismaService,
                    useFactory: () => ({
                        menusPalabras: {
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
                    }),
                },
            ],
        }).compile();

        menusPalabrasService = module.get<MenusPalabrasService>(MenusPalabrasService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('getMenusPalabras method', () => {
        it('should invoke prismaService.menusPalabras.findMany', async () => {
            await menusPalabrasService.getMenusPalabras();
            expect(prismaService.menusPalabras.findMany).toHaveBeenCalled();
        });
    });

    describe('getMenuPalabraById method', () => {
        it('should invoke prismaService.menusPalabras.findUnique', async () => {
            const testParams = {
                menu_palabra_id: 1
            };
            await menusPalabrasService.getMenuPalabraById(
                testParams.menu_palabra_id
            );
            expect(prismaService.menusPalabras.findUnique).toHaveBeenCalled();
        });
    });

    describe('createMenuPalabra method', () => {
        it('should invoke prismaService.menusPalabras.create', async () => {
            const testParams = {
                data: {
                    menu_id: 1,
                    palabra: "Palabra"
                }
            };
            await menusPalabrasService.createMenuPalabra(
                testParams.data,
            );
            expect(prismaService.menusPalabras.create).toHaveBeenCalled();
        });
    });

    describe('updateMenuPalabra method', () => {
        it('should invoke prismaService.menusPalabras.update', async () => {
            const testParams = {
                data: {
                    menu_id: 1,
                    palabra: "Palabra",
                    menu_palabra_id: 2
                }
            };
            await menusPalabrasService.updateMenuPalabra(
                testParams.data
            );
            expect(prismaService.menusPalabras.update).toHaveBeenCalled();
        });
    });

    describe('deleteMenuPalabra method', () => {
        it('should invoke prismaService.menusPalabras.delete', async () => {
            const testParams = {
                menu_palabra_id: 2

            };
            await menusPalabrasService.deleteMenuPalabra(
                testParams.menu_palabra_id
            );
            expect(prismaService.menusPalabras.delete).toHaveBeenCalled();
        });
    });
});
