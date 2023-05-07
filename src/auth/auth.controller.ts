import { RegisterAuthUserDto } from './dto/register-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { multerOptions } from '../s3/multer.config';
import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  Res,
  Body,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Public } from './public.decorator';
import { Response } from 'express';

import { COOKIE_AUTH_NAME, Mb, SECURE_COOKIE_OPTION } from '../utils/constant';
import { OurConfigService } from '../global/config.service';

import { LoginAuthUserDto } from './dto/login-auth-user.dto';

import { User } from '../_gen/prisma-class/user';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: OurConfigService,
  ) {}

  @Public()
  @Post('/register')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerOptions(4 * Mb)))
  async register(
    @Body() body: RegisterAuthUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    body.file = file;
    return await this.authService.createAccount(body);
  }

  @Public()
  @Post('/login')
  async login(
    @Body() body: LoginAuthUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(body);

    res.cookie(COOKIE_AUTH_NAME, token.access_token, {
      ...SECURE_COOKIE_OPTION,
      maxAge: this.configService.getConfig().cookieExpire,
    });

    return token;
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
    res.cookie(COOKIE_AUTH_NAME, '', {
      ...SECURE_COOKIE_OPTION,
    });
    return;
  }
}
