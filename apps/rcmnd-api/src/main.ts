import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend app (e.g., localhost:4200)
  app.enableCors({
    origin: 'http://localhost:4200',
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3100;
  await app.listen(port);

  Logger.log(
    `🚀 Recommendation API is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
