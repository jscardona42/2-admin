import { Test } from '@nestjs/testing';
import { LoginResolver } from './login.resolver';
import { LoginService } from './login.service';

describe('Login Resolver', () => {
  let loginResolver: LoginResolver;
  let loginService: LoginService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LoginResolver,
        {
          provide: LoginService,
          useFactory: () => ({
            getLogin: jest.fn(),
            getLoginById: jest.fn(),
            signInLogin: jest.fn(),
            signUpLogin: jest.fn()
          }),
        },
      ],
    }).compile();

    loginResolver = module.get<LoginResolver>(LoginResolver);
    loginService = module.get<LoginService>(LoginService);
  });

  describe('Query getLogin()', () => {
    it('should invoke loginService.getLogin()', async () => {
      await loginResolver.getLogin();
      expect(loginService.getLogin).toHaveBeenCalled();
    });
  });

  describe('Query getLoginById()', () => {
    it('should invoke loginService.getLoginById', async () => {
      const testParams = {
        id: 1
      };
      await loginResolver.getLoginById(testParams.id);
      expect(loginService.getLoginById).toHaveBeenCalled();
    });
  });

  describe('Query signInLogin()', () => {
    it('should invoke loginService.signInLogin', async () => {
      const testParams = {
        data: {
          username: "usuario1",
          password: "12345"
        }
      };
      await loginResolver.signInLogin(testParams.data);
      expect(loginService.signInLogin).toHaveBeenCalled();
    });
  });

  describe('Mutation signUpLogin()', () => {
    it('should invoke loginService.signUpLogin with arguments', async () => {
      const testParams = {
        data: {
          username: "usuario1",
          password: "12345",
          salt: "",
          token: "",
          rol_id: 1
        }
      };
      await loginResolver.signUpLogin(testParams.data);
      expect(loginService.signUpLogin).toHaveBeenCalledWith(
        testParams.data
      );
    });
  });
});