import { Injectable } from '@nestjs/common';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  validateSync,
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
  @Min(1)
  readonly port = Number(process.env.PORT || '3000');
  @IsEnum(NODE_ENV)
  readonly NODE_ENV = process.env.NODE_ENV;
  @IsBoolean()
  readonly isDebug = process.env.NODE_ENV != NODE_ENV.production;
  //

  @IsString()
  @IsNotEmpty()
  readonly jwtSecret = process.env.JWT_SECRET;

  @IsNumber()
  @Min(1)
  readonly jwtExpire = Number(process.env.JWT_EXPIRE_IN_HOUR) * 3600;

  @IsString()
  @IsNotEmpty()
  readonly cookieSignKey = process.env.COOKIE_SIGN_KEY;

  @IsString()
  @IsNotEmpty()
  readonly jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

  @IsNumber()
  @Min(1)
  readonly jwtRefreshExpire =
    Number(process.env.JWT_REFRESH_EXPIRE_IN_DAY) * 86400;

  @IsString()
  @IsNotEmpty()
  readonly frontendUrl = process.env.FRONTEND_URL;

  @IsString()
  @IsNotEmpty()
  readonly S3_ACCESS_KEY = process.env.S3_ACCESS_KEY;
  @IsString()
  @IsNotEmpty()
  readonly S3_SECRET_KEY = process.env.S3_SECRET_KEY;
  @IsString()
  @IsNotEmpty()
  readonly S3_REGION = process.env.S3_REGION;
  @IsString()
  @IsNotEmpty()
  readonly S3_BUCKET = process.env.S3_BUCKET;

  private validateEnv() {
    const errors = validateSync(this);
    if (errors.length) {
      console.log({
        target: errors[0].target,
        property: errors[0].property,
        constraints: errors[0].constraints,
      });
      throw new Error('.env values is not valid, Errors:');
    }
  }
}
