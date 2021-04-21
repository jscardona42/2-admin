import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { LoginService } from './login.service';
import { SignInUserInput, SignUpUserInput, Login } from './login.entity';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { GqlAuthGuard } from 'src/admin/authguard.guard';
var QRCode = require('qrcode')

@Resolver(() => Login)
export class LoginResolver {

  constructor(
    private readonly loginService: LoginService
  ) { }

  @Query(() => [Login])
  // @UseGuards(GqlAuthGuard)
  async getLogin(@Context('res') res) {
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
    @Args("data") data: SignInUserInput, @Context('req') req) {
    return await this.loginService.signInLogin(data, req);
  }

  @Mutation(returns => Login)
  @UsePipes(ValidationPipe)
  async signUpLogin(
    @Args("data") data: SignUpUserInput,
    @Context() ctx): Promise<Login> {

    return this.loginService.signUpLogin(data);
  }

}
