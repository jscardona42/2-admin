import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { LoginService } from './login.service';
import { SignInUserInput, SignUpUserInput, Login } from './login.entity';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
var QRCode = require('qrcode')

@Resolver(() => Login)
export class LoginResolver {

  constructor(
    private readonly loginService: LoginService
  ) { }

  @Query(() => [Login])
  // @UseGuards(GqlAuthGuard)
  async getLogin() {
    return await this.loginService.getLogin();
  }

  @Query((returns) => Login)
  // @UseGuards(GqlAuthGuard)
  getLoginById(@Args('id') id: number): Promise<Login> {
    return this.loginService.getLoginById(id);
  }

  @Query(returns => Login)
  @UsePipes(ValidationPipe)
  async signInLogin(
    @Args("data") data: SignInUserInput, @Context('res') res: Response) {
    return await this.loginService.signInLogin(data, res);

  }

  @Mutation(returns => Login)
  @UsePipes(ValidationPipe)
  async signUpLogin(
    @Args("data") data: SignUpUserInput,
    @Context() ctx): Promise<Login> {

    return this.loginService.signUpLogin(data);
  }

}
