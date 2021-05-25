import { Test } from '@nestjs/testing';
import { RolePermissionResolver } from './rolepermission.resolver';
import { RolePermissionService } from './rolepermission.service';

describe('RolesPermissions Resolver', () => {
  let rolePermissionResolver: RolePermissionResolver;
  let rolePermissionService: RolePermissionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RolePermissionResolver,
        {
          provide: RolePermissionService,
          useFactory: () => ({
            getRolesPermissions:jest.fn()
          }),
        },
      ],
    }).compile();

    rolePermissionResolver = module.get<RolePermissionResolver>(RolePermissionResolver);
    rolePermissionService = module.get<RolePermissionService>(RolePermissionService);
  });


  describe('Query getRolesPermissions()', () => {
    it('should invoke permissionService.getRolesPermissions()', async () => {
      await rolePermissionResolver.getRolesPermissions();
      expect(rolePermissionService.getRolesPermissions).toHaveBeenCalled();
    });
  });

});