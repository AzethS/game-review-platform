/**
 * Entry point for the Data API.
 * Includes Swagger documentation, global configurations, and enhanced logging.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApiResponseInterceptor } from '@game-platform/backend/dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*', // Allow all origins; restrict this in production to specific domains.
  });

  // Apply global interceptor for consistent API responses
  app.useGlobalInterceptors(new ApiResponseInterceptor());

  // Global prefix for all routes
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Swagger setup for API documentation
  const config = new DocumentBuilder()
    .setTitle('Game Review Recommendation API')
    .setDescription('API for managing games, reviews, and recommendations')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  // Server configuration
  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`🚀 Data API is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📚 Swagger docs available at: http://localhost:${port}/${globalPrefix}/docs`);
}

bootstrap();
