import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Neo4jModule } from 'nest-neo4j';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jBackendModule } from '@gamereview/backend/neo4j';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        scheme: config.get<string>('NEO4J_SCHEME', 'neo4j'),
        host: config.get<string>('NEO4J_HOST', 'localhost'),
        port: config.get<number>('NEO4J_PORT', 7687),
        username: config.get<string>('NEO4J_USERNAME', 'neo4j'),
        password: config.get<string>('NEO4J_PASSWORD', ''),
        database: config.get<string>('NEO4J_DATABASE', 'neo4j'),
      }),
    }),

    Neo4jBackendModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
