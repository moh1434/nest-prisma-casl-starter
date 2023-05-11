import { RegisterAuthUserDto } from './dto/register-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { multerOptions } from '../-tools/s3/multer.config';
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
import { Public } from './auth-utils/public.decorator';
import { Response } from 'express';

import { COOKIE_AUTH_NAME, Mb, SECURE_COOKIE_OPTION } from '../-utils/constant';

import { LoginAuthUserDto } from './dto/login-auth-user.dto';

import { Env } from '../-global/env';
import { Request, Route } from 'tsoa';

@Route('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly env: Env,
  ) {}

  @Public()
  @Post('/register')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerOptions(4 * Mb)))
  async register(
    @Request() @Body() body: RegisterAuthUserDto,
    @Request() @UploadedFile() file: Express.Multer.File,
  ) {
    body.file = file;
    return await this.authService.createAccount(body);
  }

  @Public()
  @Post('/login')
  async login(
    @Request() @Body() body: LoginAuthUserDto,
    @Request() @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(body);

    res.cookie(COOKIE_AUTH_NAME, token.access_token, {
      ...SECURE_COOKIE_OPTION,
      maxAge: this.env.cookieExpire,
    });

    return token;
  }

  @Get('logout')
  async logout(
    @Request() @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    res.cookie(COOKIE_AUTH_NAME, '', {
      ...SECURE_COOKIE_OPTION,
    });
    return;
  }
}
