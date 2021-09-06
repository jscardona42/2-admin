import { Test } from '@nestjs/testing';
import { RolesPermisosService } from '../Admin/RolesPermisos/rolespermisos.service';
import { LoginService } from '../Login/login.service';
import { UsuariosService } from '../Usuarios/usuarios.service';
import { PrismaService } from '../prisma.service';
import { MenusService } from './menus.service';
import { JwtModule } from '@nestjs/jwt';
import { AuditoriasService } from '../Auditorias/auditorias.service';
import { EntidadesService } from '../Admin/Entidades/entidades.service';
import { RolesService } from '../Admin/Roles/roles.service';
import { PermisosService } from '../Admin/Permisos/permisos.service';
import { ValidacionesService } from '../Admin/Validaciones/validaciones.service';

describe('Menu Service', () => {
  let menuService: MenusService;
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
        MenusService, RolesPermisosService, LoginService, UsuariosService, AuditoriasService, EntidadesService, RolesService, PermisosService, ValidacionesService,
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
          }),
        },
      ],
    }).compile();

    menuService = module.get<MenusService>(MenusService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createRootMenu method', () => {
    it('should invoke prismaService.menus.create', async () => {
      await menuService.createRootMenu();
      expect(prismaService.menus.create).toHaveBeenCalled();
    });
  });

  describe('createFolder method', () => {
    it('should invoke prismaService.menus.create', async () => {
      const testParams = {
        data: {
          parentId: 2,
          name: "Nombre",
          entidad_id: 1
        }
      };
      await menuService.createFolder(testParams.data);
      expect(prismaService.menus.create).toHaveBeenCalled();
    });
  });

  describe('insertEntityToFolder method', () => {
    it('should invoke prismaService.menus.create', async () => {
      const testParams = {
        data: {
          parentId: 2,
          name: "Nombre",
          entidad_id: 1
        }
      };
      await menuService.insertEntityToFolder(testParams.data);
      expect(prismaService.menus.create).toHaveBeenCalled();
    });
  });
});
