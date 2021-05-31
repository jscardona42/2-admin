import { Test } from '@nestjs/testing';
import {  RolesPermisosResolver } from './rolespermisos.resolver';
import { RolesPermisosService } from './rolespermisos.service';

describe('RolesPermissions Resolver', () => {
  let rolePermissionResolver: RolesPermisosResolver;
  let rolePermissionService: RolesPermisosService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RolesPermisosResolver,
        {
          provide: RolesPermisosService,
          useFactory: () => ({
            getRolesPermissions:jest.fn()
          }),
        },
      ],
    }).compile();

    rolePermissionResolver = module.get<RolesPermisosResolver>(RolesPermisosResolver);
    rolePermissionService = module.get<RolesPermisosService>(RolesPermisosService);
  });


  describe('Query getRolesPermissions()', () => {
    it('should invoke permissionService.getRolesPermissions()', async () => {
      await rolePermissionResolver.getRolesPermisos();
      expect(rolePermissionService.getRolesPermisos).toHaveBeenCalled();
    });
  });

});