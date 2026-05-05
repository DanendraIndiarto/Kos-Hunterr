import * as dotenv from 'dotenv';
dotenv.config(); // ⬅️ WAJIB biar .env kebaca

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // 🔎 DEBUG ENV
  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Kos API')
    .setDescription('Backend API penyedia layanan kos-kosan')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3020);

  console.log(`🚀 Server running on port ${process.env.PORT ?? 3020}`);
}
void bootstrap();
