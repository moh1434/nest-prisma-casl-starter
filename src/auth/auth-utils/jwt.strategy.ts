import { AuthService } from '../auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { COOKIE_AUTH_NAME } from '../../-utils/constant';
import { Env } from '../../-global/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(public authService: AuthService, env: Env) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: env.jwtSecret,
    });
  }

  async validate(payload: any) {
    return payload;
  }

  private static extractJWTFromCookie(req: RequestExtended): string | null {
    const token = req.signedCookies[COOKIE_AUTH_NAME];
    if (token) return token;
    return null;
  }
}
