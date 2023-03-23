import { PasswordHashService } from '../global/password.helper';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { OurConfigService } from 'src/global/config.service';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: OurConfigService) => ({
        secret: configService.getConfig().jwtSecret,
        signOptions: { expiresIn: configService.getConfig().jwtExpire },
      }),
      inject: [OurConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PasswordHashService],
})
export class AuthModule {}
