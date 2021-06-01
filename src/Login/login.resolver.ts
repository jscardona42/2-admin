import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { LoginService } from './login.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Login } from './entities/login.entity';
import { ChangePasswordInput, SignInUserInput, SignUpUserInput } from './dto/login.dto';

@Resolver(() => Login)
export class LoginResolver {

  constructor(
    private readonly loginService: LoginService
  ) { }

  @Query(() => [Login])
  async getLogin(): Promise<Login[]> {
    return await this.loginService.getLogin();
  }

  @Query((returns) => Login)
  getLoginById(@Args('id') id: number): Promise<Login> {
    return this.loginService.getLoginById(id);
  }

  @Query(returns => Login)
  @UsePipes(ValidationPipe)
  async signInLogin(
    @Args("data") data: SignInUserInput): Promise<Login> {
    return await this.loginService.signInLogin(data);
  }

  @Mutation(returns => Login)
  @UsePipes(ValidationPipe)
  async signUpLogin(
    @Args("data") data: SignUpUserInput): Promise<Login> {
    return this.loginService.signUpLogin(data);
  }

  @Mutation(returns => Login)
  @UsePipes(ValidationPipe)
  async logOutLogin(
    @Args("login_id") login_id: number): Promise<Login> {
    return this.loginService.logOutLogin(login_id);
  }

  @Mutation(returns => Login)
  @UsePipes(ValidationPipe)
  async exChangePasswordLogin(
    @Args("data") data: ChangePasswordInput): Promise<Login> {
    return this.loginService.exChangePasswordLogin(data);
  }

}
