// libs/backend/neo4j/src/lib/neo4j-backend.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameSchema } from '@game-platform/backend/features';
import { Neo4jController } from './neo4j.controller';
import { Neo4jGamesService } from './neo4j-games.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Game', schema: GameSchema }])],
  controllers: [Neo4jController],
  providers: [Neo4jGamesService],
})
export class Neo4jBackendModule {}
