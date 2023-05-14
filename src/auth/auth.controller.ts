import { JwtUser } from './auth-utils/user.decorator';
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
  UseGuards,
  Req,
} from '@nestjs/common';
import { Public } from './auth-utils/public.decorator';
import { Response } from 'express';

import {
  COOKIE_ACCESS_TOKEN_NAME,
  COOKIE_REFRESH_TOKEN_NAME,
  Mb,
  SECURE_COOKIE_OPTION,
} from '../-utils/constant';

import { LoginAuthUserDto } from './dto/login-auth-user.dto';

import { Env } from '../-global/env';
import { Request, Route } from 'tsoa';
import { TokenData } from './auth-utils/types-auth';
import { RefreshTokenGuard } from './auth-utils/jwt-refresh.guard';
import { RequestExtended } from '../-global/global_types';

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
    const tokens = await this.authService.login(body);

    res.cookie(COOKIE_ACCESS_TOKEN_NAME, tokens.access_token, {
      ...SECURE_COOKIE_OPTION,
      maxAge: this.env.jwtExpire,
    });
    res.cookie(COOKIE_REFRESH_TOKEN_NAME, tokens.refresh_token, {
      ...SECURE_COOKIE_OPTION,
      maxAge: this.env.jwtRefreshExpire,
    });

    return tokens;
  }

  @Get('logout')
  async logout(
    @Request() @JwtUser() tokenData: TokenData,
    @Request() @Res({ passthrough: true }) res: Response,
  ) {
    this.authService.logout(tokenData);
    res.cookie(COOKIE_ACCESS_TOKEN_NAME, '', SECURE_COOKIE_OPTION);
    res.cookie(COOKIE_REFRESH_TOKEN_NAME, '', SECURE_COOKIE_OPTION);
    return;
  }

  @Public() //this exclude the global JwtAuthGuard
  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  async refreshTokens(
    @Request() @JwtUser() tokenData: TokenData,
    @Request() @Req() req: RequestExtended,
    @Request() @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken =
      req.signedCookies[COOKIE_REFRESH_TOKEN_NAME] || req.headers.authorization;

    const { access_token } = await this.authService.useRefreshToken(
      tokenData,
      refreshToken,
    );

    res.cookie(COOKIE_ACCESS_TOKEN_NAME, access_token, {
      ...SECURE_COOKIE_OPTION,
      maxAge: this.env.jwtExpire,
    });

    return { access_token };
  }
}
