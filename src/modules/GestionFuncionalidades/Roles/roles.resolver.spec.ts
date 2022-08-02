import { Test } from '@nestjs/testing';
import { AddFuncionalidadesToRolInput, CreateRolInput, UpdateRolInput } from './dto/roles.dto';
import { TbRolesResolver } from './roles.resolver';
import { TbRolesService } from './roles.service';

describe('Roles Resolver', () => {
  let roleResolver: TbRolesResolver;
  let roleService: TbRolesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TbRolesResolver,
        {
          provide: TbRolesService,
          useFactory: () => ({
            getRoles: jest.fn(),
            getRolById: jest.fn(),
            getFilterRoles: jest.fn(),
            createRol: jest.fn(),
            updateRol: jest.fn(),
            addFuncionalidadesToRol: jest.fn(),
            deleteRol: jest.fn(),
          }),
        },
      ],
    }).compile();

    roleResolver = module.get<TbRolesResolver>(TbRolesResolver);
    roleService = module.get<TbRolesService>(TbRolesService);
  });


  describe('Query getRoles()', () => {
    it('should invoke rolesService.getRoles()', async () => {
      await roleResolver.getRoles();
      expect(roleService.getRoles).toHaveBeenCalled();
    });
  });

  describe('Query getRolById()', () => {
    it('should invoke rolesService.getRolById', async () => {
      const testParams = {
        rol_id: 1
      };
      await roleResolver.getRolById(testParams.rol_id);
      expect(roleService.getRolById).toHaveBeenCalled();
    });
  });

  describe('Query getFilterRoles()', () => {
    it('should invoke rolesService.getFilterRoles()', async () => {
      const testParams = {
        rol: "a"
      };
      await roleResolver.getFilterRoles(testParams.rol);
      expect(roleService.getFilterRoles).toHaveBeenCalled();
    });
  });

  describe('Mutation createRol()', () => {
    it('should invoke rolesService.createRol', async () => {
      var testParams: CreateRolInput;
      await roleResolver.createRol(testParams);
      expect(roleService.createRol).toHaveBeenCalledWith(testParams);
    });
  });

  describe('Mutation updateRol()', () => {
    it('should invoke rolesService.updateRol', async () => {
      var testParams: UpdateRolInput;
      await roleResolver.updateRol(testParams);
      expect(roleService.updateRol).toHaveBeenCalledWith(testParams);
    });
  });

  describe('Mutation addFuncionalidadesToRol()', () => {
    it('should invoke rolesService.addFuncionalidadesToRol', async () => {
      var testParams: AddFuncionalidadesToRolInput;
      await roleResolver.addFuncionalidadesToRol(testParams);
      expect(roleService.addFuncionalidadesToRol).toHaveBeenCalledWith(testParams);
    });
  });

  describe('Mutation deleteRol()', () => {
    it('should invoke rolesService.deleteRol', async () => {
      var testParams = {
        rol_id: 1
      };
      await roleResolver.deleteRol(testParams.rol_id);
      expect(roleService.deleteRol).toHaveBeenCalled();
    });
  });

});