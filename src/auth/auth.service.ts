import { RegisterUserDto } from './dto/create-user.dto';

import { PasswordHashService } from '../global/password.helper';
import { Injectable, UnauthorizedException, Body } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

import { TokenData, UserWithoutPassword } from './types-auth';
import { LoginReqDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private hash: PasswordHashService,
  ) {}
  private async validateUserPassword(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException();

    const isRightPassword = await this.hash.compare(password, user.password);
    if (!isRightPassword) throw new UnauthorizedException();

    delete user.password;
    return user as UserWithoutPassword;
  }

  private async generateToken(tokenData: TokenData) {
    return {
      access_token: this.jwtService.sign(tokenData),
    };
  }
  //
  async createAccount(body: RegisterUserDto) {
    const hashedPassword = await this.hash.hash(body.password);
    const createdUser = await this.userService.create({
      email: body.email,
      password: hashedPassword,
    });

    return createdUser;
  }
  async login(body: LoginReqDto) {
    const validateUser = await this.validateUserPassword(
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
    this.userService.updatePassword(id, hashedPassword);
  }
}
