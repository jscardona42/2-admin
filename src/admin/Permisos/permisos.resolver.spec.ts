import { Test } from '@nestjs/testing';
import { PermisosResolver } from './permisos.resolver';
import { PermisosService } from './permisos.service';

describe('Permission Resolver', () => {
  let permissionResolver: PermisosResolver;
  let permissionService: PermisosService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PermisosResolver,
        {
          provide: PermisosService,
          useFactory: () => ({
            getPermissions: jest.fn(),
            getRoles: jest.fn(),
            getRolesPermissions:jest.fn()
          }),
        },
      ],
    }).compile();

    permissionResolver = module.get<PermisosResolver>(PermisosResolver);
    permissionService = module.get<PermisosService>(PermisosService);
  });

  describe('Query getPermissions()', () => {
    it('should invoke adminService.getPermissions()', async () => {
      await permissionResolver.getPermisos();
      expect(permissionService.getPermisos).toHaveBeenCalled();
    });
  });

});