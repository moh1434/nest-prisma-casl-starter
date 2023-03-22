import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from './validation/validation.pipe';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';
import { OurConfigService } from './global/config.service';
import { VersioningType } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(OurConfigService).getConfig();

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
  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  app.useGlobalPipes(new ValidationPipe());
  //s: Swagger
  const config = new DocumentBuilder()
    .addBearerAuth(undefined, 'addBearerAuth')
    .addCookieAuth('token', {
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

  // log
  if (configService.isDebug) {
    app.use(morgan('dev'));
  }
  // cookie
  app.use(cookieParser(configService.cookieKey));

  await app.listen(configService.port);
}
bootstrap();

//swigger rather than postman
