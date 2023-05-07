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

@Injectable()
export class Env {
  @IsNumber()
  static readonly port = parseInt(process.env.PORT || '3000');
  @IsEnum(NODE_ENV)
  static readonly NODE_ENV = process.env.NODE_ENV;
  @IsBoolean()
  static readonly isDebug = process.env.NODE_ENV != NODE_ENV.production;
  //

  @IsString()
  static readonly jwtSecret = process.env.JWT_SECRET;

  @IsNumber()
  static readonly jwtExpire =
    parseInt(process.env.JWT_EXPIRE_IN_DAY as string) * 86400;

  @IsString()
  static readonly cookieKey = process.env.COOKIE_KEY;

  @IsNumber()
  static readonly cookieExpire =
    parseInt(process.env.COOKIE_EXPIRE_IN_DAY as string) * 86400;

  @IsString()
  static readonly frontendUrl = process.env.FRONTEND_URL;

  @IsString()
  static readonly S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
  @IsString()
  static readonly S3_SECRET_KEY = process.env.S3_SECRET_KEY;
  @IsString()
  static readonly S3_REGION = process.env.S3_REGION;
  @IsString()
  static readonly S3_BUCKET = process.env.S3_BUCKET;
}

export async function validateEnv() {
  try {
    await validateOrReject(Env);
  } catch (errors) {
    console.log({
      target: errors[0].target,
      property: errors[0].property,
      constraints: errors[0].constraints,
    });
    throw new Error('.env values is not valid, Errors:');
  }
}
