import { Test } from '@nestjs/testing';
import { PermisosResolver } from './permisos.resolver';
import { PermisosService } from './permisos.service';

describe('Permission Resolver', () => {
  let permisosResolver: PermisosResolver;
  let permisosService: PermisosService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PermisosResolver,
        {
          provide: PermisosService,
          useFactory: () => ({
            getPermisos: jest.fn(),
            getRoles: jest.fn(),
            getRolesPermisos:jest.fn()
          }),
        },
      ],
    }).compile();

    permisosResolver = module.get<PermisosResolver>(PermisosResolver);
    permisosService = module.get<PermisosService>(PermisosService);
  });

  describe('Query getPermisos()', () => {
    it('should invoke adminService.getPermissions()', async () => {
      await permisosResolver.getPermisos();
      expect(permisosService.getPermisos).toHaveBeenCalled();
    });
  });

});