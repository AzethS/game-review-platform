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

  // Define allowed CORS origins based on environment
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://your-production-frontend.com'] 
    : ['http://localhost:4200']; // Development Frontend URL

  // Enable CORS with dynamic origins
  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
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
  const port = parseInt(process.env.DATA_API_PORT || '3000', 10);
  await app.listen(port);

  // Logs for debugging and confirmation
  Logger.log(`🚀 Data API is running on: http://localhost:${port}/${globalPrefix}`);
  Logger.log(`📚 Swagger docs available at: http://localhost:${port}/${globalPrefix}/docs`);
  Logger.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  Logger.log(`CORS Allowed Origins: ${allowedOrigins}`);
}

bootstrap();
