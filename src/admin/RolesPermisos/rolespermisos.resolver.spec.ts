import { Test } from '@nestjs/testing';
import { CreateRolPermisoMany, UpdateRolPermisoInput } from './dto/rolespermisos.dto';
import {  RolesPermisosResolver } from './rolespermisos.resolver';
import { RolesPermisosService } from './rolespermisos.service';

describe('RolesPermissions Resolver', () => {
  let rolesPermisosResolver: RolesPermisosResolver;
  let rolesPermisosService: RolesPermisosService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RolesPermisosResolver,
        {
          provide: RolesPermisosService,
          useFactory: () => ({
            getRolesPermisos:jest.fn(),
            getRolPermisoById:jest.fn(),
            createRolPermiso:jest.fn(),
            updateRolPermiso:jest.fn(),
            deleteRolPermiso:jest.fn()
          }),
        },
      ],
    }).compile();

    rolesPermisosResolver = module.get<RolesPermisosResolver>(RolesPermisosResolver);
    rolesPermisosService = module.get<RolesPermisosService>(RolesPermisosService);
  });


  describe('Query getRolesPermisos()', () => {
    it('should invoke permissionService.getRolesPermisos()', async () => {
      await rolesPermisosResolver.getRolesPermisos();
      expect(rolesPermisosService.getRolesPermisos).toHaveBeenCalled();
    });
  });

  describe('Query getRolPermisoById()', () => {
    it('should invoke rolesPermisosService.getRolPermisoById', async () => {
        const testParams = {
            rol_permiso_id: 1
        };
        await rolesPermisosResolver.getRolPermisoById(testParams.rol_permiso_id);
        expect(rolesPermisosService.getRolPermisoById).toHaveBeenCalled();
    });
});

describe('Mutation createRolPermiso()', () => {
    it('should invoke rolesPermisosService.createRolPermiso', async () => {
        var testParams: CreateRolPermisoMany;
        await rolesPermisosResolver.createRolPermiso(testParams);
        expect(rolesPermisosService.createRolPermiso).toHaveBeenCalledWith(testParams);
    });
});

describe('Mutation updateRolPermiso()', () => {
    it('should invoke rolesPermisosService.updateRolPermiso', async () => {
        var testParams: UpdateRolPermisoInput;
        await rolesPermisosResolver.updateRolPermiso(testParams);
        expect(rolesPermisosService.updateRolPermiso).toHaveBeenCalledWith(testParams);
    });
});

describe('Mutation deleteRolPermiso()', () => {
    it('should invoke rolesPermisosService.deleteRolPermiso', async () => {
        var testParams = {
            rol_permiso_id: 1
        };
        await rolesPermisosResolver.deleteRolPermiso(testParams.rol_permiso_id);
        expect(rolesPermisosService.deleteRolPermiso).toHaveBeenCalled();
    });
});

});