import { Test } from '@nestjs/testing';
import { UpdatePermisoInput } from './dto/permisos.dto';
import { PermisosResolver } from './permisos.resolver';
import { PermisosService } from './permisos.service';

describe('Permisos Resolver', () => {
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
            getPermisoById: jest.fn(),
            getFilterPermisos: jest.fn(),
            updatePermiso: jest.fn(),
            deletePermiso: jest.fn()
          }),
        },
      ],
    }).compile();

    permisosResolver = module.get<PermisosResolver>(PermisosResolver);
    permisosService = module.get<PermisosService>(PermisosService);
  });

  describe('Query getPermisos()', () => {
    it('should invoke permisosService.getPermissions()', async () => {
      await permisosResolver.getPermisos();
      expect(permisosService.getPermisos).toHaveBeenCalled();
    });
  });


  describe('Query getPermisoById()', () => {
    it('should invoke permisosService.getPermisoById', async () => {
      const testParams = {
        permiso_id: 1
      };
      await permisosResolver.getPermisoById(testParams.permiso_id);
      expect(permisosService.getPermisoById).toHaveBeenCalled();
    });
  });

  describe('Query getFilterPermisos()', () => {
    it('should invoke permisosService.getFilterPermisos()', async () => {
      const testParams = {
        permiso: "a"
      };
      await permisosResolver.getFilterPermisos(testParams.permiso);
      expect(permisosService.getFilterPermisos).toHaveBeenCalled();
    });
  });

  describe('Mutation updatePermiso()', () => {
    it('should invoke permisosService.updatePermiso', async () => {
      var testParams: UpdatePermisoInput;
      await permisosResolver.updatePermiso(testParams);
      expect(permisosService.updatePermiso).toHaveBeenCalledWith(testParams);
    });
  });

  describe('Mutation deletePermiso()', () => {
    it('should invoke permisosService.deletePermiso', async () => {
      var testParams = {
        permiso_id: 1
      };
      await permisosResolver.deletePermiso(testParams.permiso_id);
      expect(permisosService.deletePermiso).toHaveBeenCalled();
    });
  });

});