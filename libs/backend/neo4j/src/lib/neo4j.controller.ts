// libs/backend/neo4j/src/lib/neo4j.controller.ts
import { Controller, Get } from '@nestjs/common';
import { Neo4jGamesService } from './neo4j-games.service';

@Controller('neo4j')
export class Neo4jController {
  constructor(private readonly neo4jGamesService: Neo4jGamesService) {}

  @Get('sync')
  async sync() {
    const result = await this.neo4jGamesService.syncGamesToNeo4j();
    return { message: result };
  }
}
