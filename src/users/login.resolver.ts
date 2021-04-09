import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { LoginService } from './login.service';
import { SignInUserInput, SignUpUserInput, Login } from './login.entity';
import { UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
const fetch = require('node-fetch');
import { Response } from 'express';
import { TwoFactorAuthenticationService } from 'src/twofactor/twoFactorAuthentication.service';
import { ConfigTwofactorInput, RecoveryCodeInput, SetTwoFactorInput, Twofactor, TwoFactorAuthenticateInput} from 'src/twofactor/twofactor.entity';
var QRCode = require('qrcode')

@Resolver(() => Login)
export class LoginResolver {

  constructor(
    private readonly loginService: LoginService,
    private readonly twoFactorService: TwoFactorAuthenticationService
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

  @Query(returns => Twofactor)
  @UsePipes(ValidationPipe)
  async configTwoFactor(
    @Args("data") data: ConfigTwofactorInput, @Context('res') res: Response) {

    var login = await this.loginService.getLoginById(data);
    var twofactor = await this.loginService.getTwoFactorByLoginId(data);
    var user = await this.loginService.getUserById(login.user_id);

    if (!twofactor.config_twofactor) {
      const { otpauthUrl, secret } = await this.twoFactorService.generateTwoFactorAuthenticationSecret(user);
      const qrCodeUrl = await this.loginService.buildQrCodeUrl(otpauthUrl);
      return await this.loginService.setTwoFactorSecret(secret, data, qrCodeUrl);
    }

    return await this.loginService.getTwoFactorById(twofactor.twofactor_id);
  }

  @Mutation(returns => Login)
  @UsePipes(ValidationPipe)
  async signUpLogin(
    @Args("data") data: SignUpUserInput,
    @Context() ctx): Promise<Login> {

    return this.loginService.signUpLogin(data);
  }

  @Query(returns => Login)
  @UsePipes(ValidationPipe)
  async validateTwoFactorCode(
    @Args("data") data: TwoFactorAuthenticateInput, @Context('res') res: Response) {

    const login = await this.loginService.getLoginById(data);
    const twofactor = await this.loginService.getTwoFactorByLoginId(data);

    const isCodeValid = this.twoFactorService.validateTwoFactorCode(
      data, twofactor
    );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    return login;
  }

  @Query(returns => Twofactor)
  @UsePipes(ValidationPipe)
  async setTwoFactorConfig(
    @Args("data") data: SetTwoFactorInput,
    @Context() ctx) {
    return this.loginService.setTwoFactorConfig(data);
  }

  @Query(returns => Twofactor)
  @UsePipes(ValidationPipe)
  async getTwoFactorById(
    @Args("twofactor_id") twofactor_id: number,
    @Context() ctx) {
    return this.loginService.getTwoFactorById(twofactor_id);
  }

  @Query(returns => Twofactor)
  @UsePipes(ValidationPipe)
  async validateRecoveryCode(
    @Args("data") data: RecoveryCodeInput,
    @Context() ctx) {
    return this.loginService.validateRecoveryCode(data);
  }

}
