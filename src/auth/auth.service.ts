import { PrismaService } from 'nestjs-prisma';
import { RegisterAuthUserDto } from './dto/register-user.dto';

import { PasswordHashService } from '../global/password.helper';
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

import { AuthUserWithoutPassword, TokenData } from './types-auth';
import { LoginAuthUserDto } from './dto/login-auth-user.dto';
import { Prisma, UserType } from '@prisma/client';
import { S3Service } from '../s3/s3.service';
import { FilePrefix } from '../utils/constant';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private hash: PasswordHashService,
    private s3Service: S3Service,
  ) {}
  static readonly select = {
    id: true,
    type: true,
    email: true,
    user: {
      select: {
        ...UserService.select,
      },
    },
  } satisfies Prisma.AuthUserSelect;

  private async generateToken(tokenData: TokenData) {
    return {
      access_token: this.jwtService.sign(tokenData),
    };
  }
  private async validateAuthUserPassword(email: string, inputPassword: string) {
    const authUser = await this.findPasswordByEmail(email);
    if (!authUser) throw new UnauthorizedException();

    const isRightPassword = await this.hash.compare(
      inputPassword,
      authUser.password,
    );
    if (!isRightPassword) throw new UnauthorizedException();

    const { password, ...userWithoutPassword } = authUser;
    return userWithoutPassword as AuthUserWithoutPassword;
  }

  //
  async createAccount(body: RegisterAuthUserDto) {
    const isUserExists = await this.prisma.authUser.findUnique({
      where: {
        email: body.email,
      },
      select: { id: true },
    });
    if (isUserExists) {
      throw new ConflictException();
    }
    let prefixedLink: string | undefined;
    if (body.file) {
      prefixedLink = await this.s3Service.replaceObject(
        {
          newFile: body.file,
          oldToDelete: null,
        },
        FilePrefix.user,
      );
    }
    delete body['file'];

    const hashedPassword = await this.hash.hash(body.password);

    const createdAuthUser = await this.prisma.authUser.create({
      data: {
        email: body.email,
        type: UserType.USER,
        password: hashedPassword,
        user: {
          create: {
            avatar: prefixedLink,
          },
        },
      },
      select: AuthService.select,
    });

    return createdAuthUser.user;
  }

  async login(body: LoginAuthUserDto) {
    const validateUser = await this.validateAuthUserPassword(
      body.email,
      body.password,
    );

    return await this.generateToken({
      id: validateUser.id,
      type: validateUser.type,
    });
  }
  async updatePassword(id: string, password: string) {
    const hashedPassword = await this.hash.hash(password);

    await this.prisma.authUser.update({
      where: { id },
      data: { password: hashedPassword },
      select: { id: true },
    });
  }

  //
  async findById(id: string) {
    const user = await this.prisma.authUser.findUniqueOrThrow({
      where: { id },
      select: AuthService.select,
    });

    return user;
  }
  async findTypeById(id: string) {
    const user = await this.prisma.authUser.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        type: true,
      },
    });

    return user;
  }

  async findPasswordByEmail(email: string) {
    const user = await this.prisma.authUser.findUnique({
      where: { email },
      select: { ...AuthService.select, password: true },
    });
    return user;
  }
}
