import { Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from 'nestjs-prisma';
import { loggingMiddleware } from './middleware/logging.middleware';
import { GlobalModule } from './global/global.module';

@Module({
  imports: [
    GlobalModule,
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware(new Logger('PrismaMiddleware'))], // configure your prisma middleware
      },
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
