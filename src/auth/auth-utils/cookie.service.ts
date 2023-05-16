import { Injectable } from '@nestjs/common';

import { Env } from '../../-global/env';
import { CookieOptions } from 'express';
import {
  COOKIE_ACCESS_TOKEN_NAME,
  COOKIE_REFRESH_TOKEN_NAME,
} from '../../-utils/constant';

import { Response } from 'express';

@Injectable()
export class CookieService {
  constructor(private env: Env) {}
  //optionsList: https://flaviocopes.com/cookies/#set-a-cookie-path
  private readonly BASE_COOKIE_OPTIONS: Readonly<CookieOptions> = {
    httpOnly: true,
    secure: true, //makes the cookie works only with HTTPS
    signed: true,
  };
  private readonly COOKIE_ACCESS_TOKEN_OPTIONS: Readonly<CookieOptions> = {
    ...this.BASE_COOKIE_OPTIONS,
    maxAge: this.env.jwtExpire * 1000,
  };
  private readonly COOKIE_REFRESH_TOKEN_OPTIONS: CookieOptions = {
    ...this.BASE_COOKIE_OPTIONS,
    maxAge: this.env.jwtRefreshExpire * 1000,
    path: 'refresh-token',
  };

  setAccessToken(res: Response, accessToken: string) {
    res.cookie(
      COOKIE_ACCESS_TOKEN_NAME,
      accessToken,
      this.COOKIE_ACCESS_TOKEN_OPTIONS,
    );
  }
  deleteAccessToken(res: Response) {
    return res.clearCookie(COOKIE_ACCESS_TOKEN_NAME);
  }

  setRefreshToken(res: Response, refreshToken: string) {
    return res.cookie(
      COOKIE_REFRESH_TOKEN_NAME,
      refreshToken,
      this.COOKIE_REFRESH_TOKEN_OPTIONS,
    );
  }

  deleteRefreshToken(res: Response) {
    return res.clearCookie(COOKIE_REFRESH_TOKEN_NAME);
  }
}
