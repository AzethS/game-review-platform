import { Injectable, OnModuleInit } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly neo4jService: Neo4jService) {}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  async onModuleInit(): Promise<void> {
    try {
      const result = await this.neo4jService.read('MATCH (n) RETURN COUNT(n) AS count');
      const count = result.records[0].get('count');
      console.log(`Successfully connected to Neo4j. Node count: ${count}`);
    } catch (error) {
      console.error('Error connecting to Neo4j', error);
    }
  }

}
