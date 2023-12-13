import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  })); // whiteliste a true permet de filtrer les données c-à-d accepter uniquement des données dans le body qui ont été définis dans le DTO
  await app.listen(3001);
}
bootstrap();
