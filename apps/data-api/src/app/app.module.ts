import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamePlatformModule } from '@game-platform/backend/features';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/game-review-platform', {
      writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 1000,
      },
      connectionFactory: (connection) => {
        console.log('MongoDB connection setup initiated');
        return connection;
      },
    }),
    GamePlatformModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
