// BigInt JSON 직렬화 지원
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

import { initSentry } from './common/sentry';
initSentry();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.setGlobalPrefix('api');
  // AllExceptionsFilter must come first so HttpExceptionFilter remains the
  // outermost matcher for HttpExceptions; AllExceptionsFilter catches the
  // rest (and 5xx HTTP errors → captured to Sentry).
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()) ?? [
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'sentry-trace',
      'baggage',
    ],
  });

  const port = process.env.PORT ?? 8080;
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}
bootstrap();
