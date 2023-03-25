import { RolesGuard } from './auth/roles.decorator';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaService } from 'nestjs-prisma';
import { OurConfigService } from './global/config.service';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { COOKIE_AUTH_NAME } from './utils/constant';
import { PrismaErrorInterceptor } from './global/prisma-error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(OurConfigService).getConfig();

  // log
  if (configService.isDebug) {
    app.use(morgan('dev'));
  }

  // cors
  app.enableCors({
    origin: configService.frontendUrl,
    credentials: true,
  });
  // enable version
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // map prisma error
  app.useGlobalInterceptors(new PrismaErrorInterceptor());

  // cookie
  app.use(cookieParser(configService.cookieKey));

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalGuards(new RolesGuard(reflector));

  //s: Swagger
  const config = new DocumentBuilder()
    .addBearerAuth(undefined, 'addBearerAuth')
    .addCookieAuth(COOKIE_AUTH_NAME, {
      type: 'http',
      in: 'Header',
      scheme: 'Bearer',
    })
    .addSecurityRequirements('addBearerAuth')
    .setTitle('nest example')
    .setDescription('My nest API description')
    .setVersion('1.0')
    .addTag('myTag')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //e: Swagger

  await app.listen(configService.port);
}
bootstrap();

//already exists or not found Prisma errors.
//permissions
//upload images
//redis
//cacheWrapper
//pm2 with logger
