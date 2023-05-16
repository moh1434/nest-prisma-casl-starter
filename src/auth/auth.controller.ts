import { CookieService } from './auth-utils/cookie.service';
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

import { COOKIE_REFRESH_TOKEN_NAME, Mb } from '../-utils/constant';

import { LoginAuthUserDto } from './dto/login-auth-user.dto';

import { Request, Route } from 'tsoa';
import { TokenData } from './auth-utils/types-auth';
import { RefreshTokenGuard } from './auth-utils/jwt-refresh.guard';
import { RequestExtended } from '../-global/global_types';

@Route('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
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

    this.cookieService.setAccessToken(res, tokens.access_token);
    this.cookieService.setRefreshToken(res, tokens.refresh_token);

    return tokens;
  }

  @Get('logout')
  async logout(
    @Request() @JwtUser() tokenData: TokenData,
    @Request() @Res({ passthrough: true }) res: Response,
  ) {
    this.authService.logout(tokenData);

    this.cookieService.deleteAccessToken(res);
    this.cookieService.deleteRefreshToken(res);

    return;
  }

  @Public() //this exclude the global JwtAuthGuard
  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token') //this also used in cookie.service.ts
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

    this.cookieService.setAccessToken(res, access_token);

    return { access_token };
  }
}
