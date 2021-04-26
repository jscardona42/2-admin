import { Test } from '@nestjs/testing';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './admin.service';

describe('Admin Resolver', () => {
  let adminResolver: AdminResolver;
  let adminService: AdminService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AdminResolver,
        {
          provide: AdminService,
          useFactory: () => ({
            getPermissions: jest.fn(),
            getRoles: jest.fn(),
            getRolesPermissions:jest.fn()
          }),
        },
      ],
    }).compile();

    adminResolver = module.get<AdminResolver>(AdminResolver);
    adminService = module.get<AdminService>(AdminService);
  });

  describe('Query getPermissions()', () => {
    it('should invoke adminService.getPermissions()', async () => {
      await adminResolver.getPermissions();
      expect(adminService.getPermissions).toHaveBeenCalled();
    });
  });

  describe('Query getRoles()', () => {
    it('should invoke adminService.getRoles()', async () => {
      await adminResolver.getRoles();
      expect(adminService.getRoles).toHaveBeenCalled();
    });
  });


  describe('Query getRolesPermissions()', () => {
    it('should invoke adminService.getRolesPermissions()', async () => {
      await adminResolver.getRolesPermissions();
      expect(adminService.getRolesPermissions).toHaveBeenCalled();
    });
  });

});