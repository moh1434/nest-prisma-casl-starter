import { LoginReqDto } from '../auth/dto/login.dto';
import { AuthService } from './auth.service';
import { Controller, Post, Res, Body, Get, Req } from '@nestjs/common';
import { Public } from './public.decorator';
import { Response } from 'express';
import { RegisterUserDto } from './dto/create-user.dto';
import { COOKIE_AUTH_NAME, SECURE_COOKIE_OPTION } from '../utils/constant';
import { OurConfigService } from '../global/config.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: OurConfigService,
  ) {}

  @Public()
  @Post('/register')
  async register(@Body() body: RegisterUserDto) {
    return await this.authService.createAccount(body);
  }

  @Public()
  @Post('/login')
  async login(
    @Body() body: LoginReqDto,
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
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie(COOKIE_AUTH_NAME, '', {
      ...SECURE_COOKIE_OPTION,
    });
    return;
  }
}
