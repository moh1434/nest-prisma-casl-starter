import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OurConfigService {
  constructor(public service: ConfigService) {}

  getConfig(): Config {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.service.get('all')!;
  }
}

export default () => {
  const configs = {
    all: {
      port: parseInt(process.env.PORT || '3000'),
      jwtSecret: process.env.SECRET_KEY,
      jwtExpire:
        (parseInt(process.env.JWT_EXPIRE_IN_DAY as string) * 86400) |
        parseInt(process.env.JWT_EXPIRE as string),
      NODE_ENV: process.env.NODE_ENV,
      isDebug: process.env.NODE_ENV != 'production',
      cookieKey: process.env.COOKIE_KEY,
      cookieExpire:
        parseInt(process.env.COOKIE_EXPIRE_IN_DAY as string) * 86400,
      frontendUrl: process.env.FORNTEND_URL,

      S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
      S3_SECRET_KEY: process.env.S3_SECRET_KEY,
      S3_REGION: process.env.S3_REGION,
      S3_BUCKET: process.env.S3_BUCKET,
    },
  };

  for (const key in configs['all']) {
    if (
      configs['all'][key] === undefined ||
      Number.isNaN(configs['all'][key])
    ) {
      throw new Error(`env.${key}=${configs['all'][key]} is invalid value`);
    }
  }
  return configs as { all: Config };
};

interface Config {
  port: number;
  jwtSecret: string;
  jwtExpire: number;
  isDebug: boolean;
  cookieKey: string;
  frontendUrl: string;
  cookieExpire: number;

  S3_ACCESS_KEY: string;
  S3_SECRET_KEY: string;
  S3_REGION: string;
  S3_BUCKET: string;
}
