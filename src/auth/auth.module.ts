import { PasswordHashService } from './auth-utils/password.helper';
import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { JwtStrategy } from './auth-utils/jwt.strategy';
import { RefreshTokenStrategy } from './auth-utils/jwt-refresh.strategy';

import { UserModule } from 'src/user/user.module';

import { S3Module } from '../-tools/s3/s3.module';

@Global()
@Module({
  imports: [UserModule, PassportModule, JwtModule.register({}), S3Module],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    PasswordHashService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
