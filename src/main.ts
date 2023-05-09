import { PrismaModel } from './-tools/swagger/generator-prisma-class';
import { RolesGuard } from './auth/auth-utils/roles.decorator';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaService } from 'nestjs-prisma';

import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { JwtAuthGuard } from './auth/auth-utils/jwt-auth.guard';
import { COOKIE_AUTH_NAME } from './-utils/constant';
import { PrismaErrorInterceptor } from './-global/prisma-error.interceptor';
import { AllExceptionsFilter } from './-global/all-exceptions.filter';
import { Env } from './-global/env';

async function bootstrap() {
  require('dotenv').config();
  console.log(process.env);
  const app = await NestFactory.create(AppModule);
  const env = app.get<Env>(Env);
  // log
  if (env.isDebug) {
    app.use(morgan('dev'));
  }

  // cors
  app.enableCors({
    origin: env.frontendUrl,
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
  app.use(cookieParser(env.cookieKey));

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
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
  // const document = SwaggerModule.createDocument(app, config);
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: PrismaModel.extraModels,
  });

  SwaggerModule.setup('api', app, document);
  //e: Swagger

  await app.listen(env.port);
}

bootstrap();
