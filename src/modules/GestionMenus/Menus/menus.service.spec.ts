import { Test } from '@nestjs/testing';
import { UsuariosService } from '../../Usuarios/usuarios.service';
import { PrismaService } from '../../../prisma.service';
import { MenusService } from './menus.service';
import { JwtModule } from '@nestjs/jwt';
import { AuditoriasService } from '../../Auditorias/auditorias.service';
import { EntidadesService } from '../../Admin/Entidades/entidades.service';
import { RolesService } from '../../Admin/Roles/roles.service';
import { PermisosService } from '../../Admin/Permisos/permisos.service';
import { ValidacionesService } from '../../Admin/Validaciones/validaciones.service';
import { CreateMenuInput } from './dto/menus.dto';

describe('Menu Service', () => {
  let menusService: MenusService;
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
        MenusService, UsuariosService, AuditoriasService, EntidadesService, RolesService, PermisosService, ValidacionesService,
        {
          provide: PrismaService,
          useFactory: () => ({
            menus: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn().mockImplementation(() => ({
                Menus: jest.fn(() => {
                  return { path: String };
                }),
              })),
              create: jest.fn(() => {
                return {
                  id: Number,
                };
              }),
              update: jest.fn(),
              delete: jest.fn(),
            },
            entidades: {
              findUnique: jest.fn(() => { return { entidad_id: 1 } }),
            },
            usuarios: {
              findUnique: jest.fn(() => { return { usuario_id: 1 } }),
            },
            rolesPermisos: {
              findMany: jest.fn(() => {
                return [{
                  rol_permiso_id: 1,
                  rol_id: 1,
                  permiso_id: 235,
                  Roles: { rol_id: 1, rol: 'Administrator' },
                  Permisos: {
                    permiso_id: 235,
                    entidad_id: 75,
                    permiso: 'MenusResolver',
                    es_publico: false,
                    Entidades: {
                      entidad_id: 75,
                      nombre: 'Menus',
                      resolver: 'MenusResolver',
                      es_entidad: true
                    }
                  }
                }]
              }),
            }
          }),
        },
      ],
    }).compile();

    menusService = module.get<MenusService>(MenusService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getMenus method', () => {
    it('should invoke prismaService.menus.findMany', async () => {
      await menusService.getMenus();
      expect(prismaService.menus.findMany).toHaveBeenCalled();
    });
  });

  describe('getMenuByid method', () => {
    it('should invoke prismaService.menus.findUnique', async () => {
      const testParams = {
        menu_id: 1
      };
      await menusService.getMenuById(
        testParams.menu_id
      );
      expect(prismaService.menus.findUnique).toHaveBeenCalled();
    });
  });

  describe('getMenusInactivos method', () => {
    it('should invoke prismaService.menus.findMany', async () => {
      await menusService.getMenusInactivos();
      expect(prismaService.menus.findMany).toHaveBeenCalled();
    });
  });

  describe('getMenuByRoleId method', () => {
    it('should invoke prismaService.menus.findMany', async () => {
      const testParams = {
        usuario_id: 1
      };
      await menusService.getMenuByRoleId(testParams.usuario_id);
      expect(prismaService.menus.findMany).toHaveBeenCalled();
    });
  });

  describe('createRootMenu method', () => {
    it('should invoke prismaService.menus.create', async () => {
      await menusService.createRootMenu();
      expect(prismaService.menus.create).toHaveBeenCalled();
    });
  });

  describe('createMenu method', () => {
    it('should invoke prismaService.menus.create', async () => {
      const testParams: CreateMenuInput = {
        parentId: 2,
        name: "Nombre",
        entidad_id: 1
      };
      await menusService.createMenu(testParams);
      expect(prismaService.menus.create).toHaveBeenCalled();
    });
  });
});
