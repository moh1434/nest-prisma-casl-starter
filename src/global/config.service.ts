import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OurConfigService {
  constructor(public service: ConfigService) {}

  getConfig(): Config {
    return this.service.get('all');
  }
}

export default () => ({
  all: <Config>{
    port: parseInt(process.env.PORT || '3000'),
    jwtSecret: process.env.SECRET_KEY,
    jwtExpire:
      (parseInt(process.env.JWT_EXPIRE_IN_DAY) * 86400) |
      parseInt(process.env.JWT_EXPIRE),
    NODE_ENV: process.env.NODE_ENV,
    isDebug: process.env.NODE_ENV != 'production',
    cookieKey: process.env.COOKIE_KEY,
    cookieExpire: parseInt(process.env.COOKIE_EXPIRE_IN_DAY) * 86400,
    frontendUrl: process.env.FORNTEND_URL,
  },
});

interface Config {
  port: number;
  jwtSecret: string;
  jwtExpire: number;
  isDebug: boolean;
  cookieKey: string;
  frontendUrl: string;
  cookieExpire: number;
}
