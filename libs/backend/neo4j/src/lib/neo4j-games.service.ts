import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as neo4j from 'neo4j-driver';
import { IGame } from '@game-platform/shared/api';
import { config } from 'dotenv';
config();

@Injectable()
export class Neo4jGamesService implements OnModuleInit {
  private driver!: neo4j.Driver;

  constructor(@InjectModel('Game') private gameModel: Model<IGame>) {}

  onModuleInit() {
    this.driver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('neo4j', '')
    );
  }

  async syncGamesToNeo4j(): Promise<string> {
    const session = this.driver.session();

    try {
      const games = await this.gameModel
        .find()
        .populate('platform createdBy')
        .exec();

      for (const game of games) {
        const genreArray = Array.isArray(game.genre) ? game.genre : [game.genre];

        await session.run(
          `
          MERGE (g:Game {id: $id})
          SET g.title = $title, g.description = $description, g.releaseDate = $releaseDate
          WITH g
          UNWIND $genres AS genreName
            MERGE (gen:Genre {name: genreName})
            MERGE (g)-[:HAS_GENRE]->(gen)
          WITH g
          UNWIND $platforms AS platformName
            MERGE (p:Platform {name: platformName})
            MERGE (g)-[:AVAILABLE_ON]->(p)
          MERGE (c:Company {name: $createdBy})
          MERGE (g)-[:CREATED_BY]->(c)
          `,
          {
            id: game._id.toString(),
            title: game.title,
            description: game.description,
            releaseDate: game.releaseDate.toISOString(),
            genres: genreArray,
            platforms: (game.platform as unknown as { name: string }[]).map(p => p.name),
            createdBy: (game.createdBy as unknown as { name: string })?.name || 'Unknown',
          }
        );
      }

      return `✅ Synced ${games.length} games to Neo4j.`;
    } catch (error) {
      console.error('Neo4j Sync Error:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
}
