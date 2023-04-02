import { Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from 'nestjs-prisma';
import { loggingMiddleware } from './global/logging.middleware';
import { GlobalModule } from './global/global.module';
import { AuthModule } from './auth/auth.module';
import { S3Module } from './s3/s3.module';

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
                log: [{ emit: 'stdout', level: 'query' }],
              }
            : undefined,
      },
    }),
    AuthModule,
    UserModule,
    S3Module,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
