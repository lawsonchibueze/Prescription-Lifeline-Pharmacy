import { join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  // bodyParser is disabled here because @thallesp/nestjs-better-auth needs
  // to read the raw request body for Better Auth's routes; it re-adds the
  // JSON/urlencoded parsers for everything else via AuthModule.forRoot().
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  // Serves apps/api/uploads/* at http://<host>/uploads/* — deliberately
  // outside the /api prefix below, same as Better Auth's routes, since
  // static assets are served at the raw Express level.
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads' });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip properties not declared on the DTO
      forbidNonWhitelisted: true, // reject requests that send unknown fields
      transform: true, // turn plain JSON into DTO class instances (and coerce types)
    }),
  );

  const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin.split(',').map((origin) => origin.trim()),
    credentials: true,
  });

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
}
void bootstrap();
