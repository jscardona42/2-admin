import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { User } from './user.entity';


@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService, private jwtService: JwtService) { }

  async findAllUsers() {
    return this.prismaService.user.findMany();
  }

  async signInUser(data) {
    const salt = await this.prismaService.user.findFirst({
      where: { email: data.email },
      select: { salt: true },
    })

    const user = await this.prismaService.user.findFirst({
      where: {
        email: data.email,
        password: await this.hashPassword(data.password, salt.salt)
      },
    })

    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const token = this.jwtService.sign({ userId: user.id, role: user.role_id });
    const updToken = this.createToken(token, user);

    return updToken;
  }

  async signUpUser(data): Promise<User> {
    const salt = await bcrypt.genSalt();

    const emailExists = await this.prismaService.user.findFirst({
      where: { email: data.email },
      select: { email: true }
    })

    if (emailExists) {
      throw new UserInputError('El email ya se encuentra registrado');
    }

    const user = this.prismaService.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: await this.hashPassword(data.password, salt),
        salt: salt,
        token: data.token,
        role_id: 3
      }
    })

    if (!user) {
      throw new UserInputError('Error');
    }

    return user;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async createToken(token: string, user) {
    const updToken = await this.prismaService.user.update({
      where: { id: user.id, },
      data: { token: token, },
      select: { token: true }
    })

    return updToken;
  }
}
