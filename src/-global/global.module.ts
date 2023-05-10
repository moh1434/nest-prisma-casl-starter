import { Env } from './env';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [Env],
  exports: [Env],
})
export class GlobalModule {}
