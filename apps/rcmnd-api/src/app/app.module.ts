import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Neo4jModule } from 'nest-neo4j';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jBackendModule } from '@gamereview/backend/neo4j';

@Module({
  imports: [
    // MongoDB connection
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/game-review-platform'),

    // Neo4j direct bolt connection
    Neo4jModule.forRoot({
      scheme: 'bolt',
      host: '127.0.0.1',
      port: 7687,
      username: 'neo4j',
      password: 'datagame',         
      database: 'neo4j',
    }),

    Neo4jBackendModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
