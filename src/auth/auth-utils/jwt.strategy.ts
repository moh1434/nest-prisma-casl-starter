import { AuthService } from '../auth.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { OurConfigService } from '../../-global/config.service';
import { COOKIE_AUTH_NAME } from '../../-utils/constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: OurConfigService, public authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getConfig().jwtSecret,
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
