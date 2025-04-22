import { Controller, Get, Param } from '@nestjs/common';
import { Neo4jGamesService } from './neo4j-games.service';

@Controller('neo4j')
export class Neo4jController {
  constructor(private readonly neo4jGamesService: Neo4jGamesService) {}

  @Get('sync/games')
  async syncGames() {
    const result = await this.neo4jGamesService.syncGamesToNeo4j();
    return { message: result };
  }

  @Get('recommend/platform/:platformId')
  async getRecommendationsByPlatform(@Param('platformId') platformId: string) {
    const recommendations = await this.neo4jGamesService.recommendGamesByPlatformId(platformId);
    return { recommendations };
  }

  @Get('recommend/user/:userId')
  async getRecommendationsByUser(@Param('userId') userId: string) {
    const recommendations = await this.neo4jGamesService.recommendGamesByUserPreferences(userId);
    return { recommendations };
  }
}