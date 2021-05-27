import { Test } from '@nestjs/testing';
import { RolesResolver } from './roles.resolver';
import { RolesService } from './roles.service';

describe('Roles Resolver', () => {
  let roleResolver: RolesResolver;
  let roleService: RolesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RolesResolver,
        {
          provide: RolesService,
          useFactory: () => ({
            getRoles: jest.fn(),
          }),
        },
      ],
    }).compile();

    roleResolver = module.get<RolesResolver>(RolesResolver);
    roleService = module.get<RolesService>(RolesService);
  });


  describe('Query getRoles()', () => {
    it('should invoke permissionService.getRoles()', async () => {
      await roleResolver.getRoles();
      expect(roleService.getRoles).toHaveBeenCalled();
    });
  });

});