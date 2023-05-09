import { Injectable } from '@nestjs/common';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  validateOrReject,
} from 'class-validator';

export enum NODE_ENV {
  production = 'production',
  development = 'development',
}

@Injectable({})
export class Env {
  constructor() {
    this.validateEnv();
  }
  @IsNumber()
  readonly port = parseInt(process.env.PORT || '3000');
  @IsEnum(NODE_ENV)
  readonly NODE_ENV = process.env.NODE_ENV;
  @IsBoolean()
  readonly isDebug = process.env.NODE_ENV != NODE_ENV.production;
  //

  @IsString()
  readonly jwtSecret = process.env.JWT_SECRET;

  @IsNumber()
  readonly jwtExpire =
    parseInt(process.env.JWT_EXPIRE_IN_DAY as string) * 86400;

  @IsString()
  readonly cookieKey = process.env.COOKIE_KEY;

  @IsNumber()
  readonly cookieExpire =
    parseInt(process.env.COOKIE_EXPIRE_IN_DAY as string) * 86400;

  @IsString()
  readonly frontendUrl = process.env.FRONTEND_URL;

  @IsString()
  readonly S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
  @IsString()
  readonly S3_SECRET_KEY = process.env.S3_SECRET_KEY;
  @IsString()
  readonly S3_REGION = process.env.S3_REGION;
  @IsString()
  readonly S3_BUCKET = process.env.S3_BUCKET;

  private async validateEnv() {
    try {
      await validateOrReject(this);
    } catch (errors) {
      console.log({
        target: errors[0].target,
        property: errors[0].property,
        constraints: errors[0].constraints,
      });
      throw new Error('.env values is not valid, Errors:');
    }
  }
}
