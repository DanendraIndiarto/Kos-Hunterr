import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🌍 Enable CORS
  app.enableCors();

  // 📦 Global Validation DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // hapus field yg tidak ada di DTO
      forbidNonWhitelisted: true,
      transform: true, // auto convert type
    }),
  );

  // 🔥 Optional: Prefix API
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3020);
}
void bootstrap();
