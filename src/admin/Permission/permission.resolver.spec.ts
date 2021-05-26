import { Test } from '@nestjs/testing';
import { RolePermissionResolver } from '../RolePermission/rolepermission.resolver';
import { PermissionResolver } from './permission.resolver';
import { PermissionService } from './permission.service';

describe('Permission Resolver', () => {
  let permissionResolver: PermissionResolver;
  let permissionService: PermissionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PermissionResolver,
        {
          provide: PermissionService,
          useFactory: () => ({
            getPermissions: jest.fn(),
            getRoles: jest.fn(),
            getRolesPermissions:jest.fn()
          }),
        },
      ],
    }).compile();

    permissionResolver = module.get<PermissionResolver>(PermissionResolver);
    permissionService = module.get<PermissionService>(PermissionService);
  });

  describe('Query getPermissions()', () => {
    it('should invoke adminService.getPermissions()', async () => {
      await permissionResolver.getPermissions();
      expect(permissionService.getPermissions).toHaveBeenCalled();
    });
  });

});