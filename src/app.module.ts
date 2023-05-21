import { Global, Logger, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './user/user.module';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { S3Module } from './s3/s3.module';
import { PostModule } from './post/post.module';
import { cacheMinute } from './utils/constant';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { Env } from './utils/env';

@Global()
@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        prismaOptions:
          process.env.NODE_ENV !== 'production'
            ? {
                // log: [{ emit: 'stdout', level: 'query' }],
              }
            : undefined,
      },
    }),
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      ttl: cacheMinute * 10,
      max: 25,
      //
      // host: process.env.REDIS_HOST,
      // port: process.env.REDIS_PORT,
      // username: process.env.REDIS_USERNAME,
      // password: process.env.REDIS_PASSWORD,
    }),
    AuthModule,
    UserModule,
    S3Module,
    PostModule,
  ],
  controllers: [],
  providers: [Env],
  exports: [Env],
})
export class AppModule {}
