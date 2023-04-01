import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration, { OurConfigService } from './config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.env.NODE_ENV}.env`, '.env'],
      load: [configuration],
      cache: true,
    }),
  ],
  providers: [OurConfigService],
  exports: [OurConfigService],
})
export class GlobalModule {}
