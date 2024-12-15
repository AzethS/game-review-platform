import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService  } from '@nestjs/config';
import { Neo4jModule, Neo4jService } from 'nest-neo4j';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Neo4jFeatureModule } from '@gamereview/backend/neo4j';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    Neo4jModule.forRootAsync({
      import: [ ConfigModule ],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        scheme: configService.get('NEO4J_SCHEME'),
        host: configService.get('NEO4J_HOST'),
        port: configService.get('NEO4J_PORT'),
        username: configService.get('NEO4J_USERNAME'),
        password: configService.get('NEO4J_PASSWORD'),
        database: configService.get('NEO4J_DATABASE')
      })
    }),
    // UserModule,
    // ArticleModule,
    Neo4jFeatureModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: []
})
export class AppModule {}
