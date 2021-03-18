import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { SignInUserInput, SignUpUserInput, User } from './user.entity';
import { Inject, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
const fetch = require('node-fetch');
import { GqlAuthGuard } from 'src/admin/authguard.guard';
import { Response } from 'express';


@Resolver(() => User)
export class UserResolver {

  constructor(
    private readonly userService: UserService
  ) { }

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  async findAllUsers() {
    return await this.userService.findAllUsers();
  }

  @Query((returns) => User)
  @UseGuards(GqlAuthGuard)
  findOneUser(@Args('id') id: number): Promise<User> {
    return this.userService.findOneUser(id);
  }

  @Query(returns => User)
  @UsePipes(ValidationPipe)
  async signInUser(
    @Args("data") data: SignInUserInput, @Context('res') res: Response) {
    return await this.userService.signInUser(data, res);
  }

  @Mutation(returns => User)
  @UsePipes(ValidationPipe)
  async signUpUser(
    @Args("data") data: SignUpUserInput,
    @Context() ctx): Promise<User> {

    return this.userService.signUpUser(data);
  }






  // @Query(() => [Product], { name: 'products' })
  // async prueba() {
  //   return fetch('http://localhost:3002/graphql', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       query: `
  //       query{
  //         products{
  //           id
  //           product
  //         }
  //       }`
  //     }),
  //   })
  //     .then(res => res.json())
  //     .then(res => console.log(res.data));
  // }





}
