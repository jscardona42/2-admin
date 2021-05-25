import { Test } from '@nestjs/testing';
import { RoleResolver } from './role.resolver';
import { RoleService } from './role.service';

describe('Roles Resolver', () => {
  let roleResolver: RoleResolver;
  let roleService: RoleService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RoleResolver,
        {
          provide: RoleService,
          useFactory: () => ({
            getRoles: jest.fn(),
          }),
        },
      ],
    }).compile();

    roleResolver = module.get<RoleResolver>(RoleResolver);
    roleService = module.get<RoleService>(RoleService);
  });


  describe('Query getRoles()', () => {
    it('should invoke permissionService.getRoles()', async () => {
      await roleResolver.getRoles();
      expect(roleService.getRoles).toHaveBeenCalled();
    });
  });

});