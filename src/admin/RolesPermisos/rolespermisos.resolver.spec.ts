import { Test } from '@nestjs/testing';
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
            getRolesPermisos:jest.fn()
          }),
        },
      ],
    }).compile();

    rolesPermisosResolver = module.get<RolesPermisosResolver>(RolesPermisosResolver);
    rolesPermisosService = module.get<RolesPermisosService>(RolesPermisosService);
  });


  describe('Query getRolesPermissions()', () => {
    it('should invoke permissionService.getRolesPermisos()', async () => {
      await rolesPermisosResolver.getRolesPermisos();
      expect(rolesPermisosService.getRolesPermisos).toHaveBeenCalled();
    });
  });

});