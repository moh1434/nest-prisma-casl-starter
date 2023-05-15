import { Logger, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './user/user.module';
import { PrismaModule } from 'nestjs-prisma';
import { loggingMiddleware } from './-global/logging.middleware';
import { AuthModule } from './auth/auth.module';
import { S3Module } from './-tools/s3/s3.module';
import { PostModule } from './post/post.module';
import { GlobalModule } from './-global/global.module';
import { cacheMinute } from './-utils/constant';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    GlobalModule,
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware(new Logger('PrismaMiddleware'))], // configure your prisma middleware
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
  providers: [],
  exports: [GlobalModule],
})
export class AppModule {}
