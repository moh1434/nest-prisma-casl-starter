import { TokenData } from 'src/auth/auth-utils/types-auth';
import { AuthService } from '../auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { COOKIE_REFRESH_TOKEN_NAME } from '../../-utils/constant';
import { Env } from '../../-global/env';
import { RequestExtended } from '../../-global/global_types';
import { tokenPayload } from './types-auth';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(public authService: AuthService, env: Env) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWTFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: env.jwtRefreshSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: RequestExtended, payload: tokenPayload) {
    return {
      id: payload.id,
      type: payload.type,
    } satisfies TokenData;
  }

  private static extractJWTFromCookie(req: RequestExtended): string | null {
    const token = req.signedCookies[COOKIE_REFRESH_TOKEN_NAME];
    if (token) return token;
    return null;
  }
}
