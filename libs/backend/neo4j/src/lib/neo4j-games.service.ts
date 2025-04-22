import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as neo4j from 'neo4j-driver';
import { IGame, IReview } from '@game-platform/shared/api';
import { config } from 'dotenv';
config();

@Injectable()
export class Neo4jGamesService implements OnModuleInit {
  private driver!: neo4j.Driver;

  constructor(
    @InjectModel('Game') private gameModel: Model<IGame>,
    @InjectModel('Review') private reviewModel: Model<IReview>
  ) {}

  onModuleInit() {
    this.driver = neo4j.driver(
      'bolt://127.0.0.1:7687',
      neo4j.auth.basic('neo4j', 'datagame')
    );
  }

  async syncGamesToNeo4j(): Promise<string> {
    const session = this.driver.session();

    try {
      const games = await this.gameModel
        .find()
        .populate([
          { path: 'platform' },
          { path: 'createdBy' },
          { path: 'reviews', populate: { path: 'userId' } },
        ])
        .exec();

      for (const game of games) {
        const genreArray = Array.isArray(game.genre)
          ? game.genre
          : [game.genre];
        const platforms = (game.platform as any[]).map((p) => ({
          id: p._id.toString(),
          name: p.name || 'Unknown',
        }));

        await session.run(
          `
          MERGE (g:Game {id: $id})
          SET g.title = $title, g.description = $description, g.releaseDate = $releaseDate
  
          WITH g
          UNWIND $genres AS genreName
            MERGE (gen:Genre {name: genreName})
            MERGE (g)-[:HAS_GENRE]->(gen)
  
          WITH g
          UNWIND $platforms AS platform
            MERGE (p:Platform {id: platform.id})
            SET p.name = platform.name
            MERGE (g)-[:AVAILABLE_ON]->(p)
  
          MERGE (c:Company {name: $createdBy})
          MERGE (g)-[:CREATED_BY]->(c)
          `,
          {
            id: game._id.toString(),
            title: game.title,
            description: game.description,
            releaseDate: game.releaseDate.toString(),
            genres: genreArray,
            platforms,
            createdBy: (game.createdBy as any)?.name || 'Unknown',
          }
        );

        for (const review of game.reviews || []) {
          const user = (review as any).userId;
          if (!user) continue;

          await session.run(
            `
            MERGE (u:User {id: $userId})
            MERGE (g:Game {id: $gameId})
            MERGE (u)-[r:RATED]->(g)
            SET r.rating = $rating
            `,
            {
              userId: user._id.toString(),
              gameId: game._id.toString(),
              rating: (review as any).rating,
            }
          );
        }
      }

      return `Synced ${games.length} games (and users/reviews) to Neo4j.`;
    } catch (error) {
      console.error('Neo4j Sync Error:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async recommendGamesByPlatformId(platformId: string): Promise<any[]> {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `
        MATCH (g:Game)-[:AVAILABLE_ON]->(p:Platform {id: $platformId})
        RETURN g
        `,
        { platformId }
      );

      return result.records.map((record) => record.get('g').properties);
    } finally {
      await session.close();
    }
  }

  async recommendGamesByUserPreferences(userId: string): Promise<any[]> {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `
        MATCH (u:User {id: $userId})-[r1:RATED]->(g1:Game)-[:HAS_GENRE]->(genre:Genre)
        WHERE r1.rating >= 4
  
        WITH DISTINCT genre, u
        MATCH (g2:Game)-[:HAS_GENRE]->(genre)
        WHERE NOT EXISTS {
          MATCH (u)-[:RATED]->(g2)
        }
  
        RETURN DISTINCT g2
        `,
        { userId }
      );
  
      return result.records.map((record) => record.get('g2').properties);
    } finally {
      await session.close();
    }
  }
  
  
}
