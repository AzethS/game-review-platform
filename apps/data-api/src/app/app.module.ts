import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from '@game-platform/backend/features';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/game-review-platform'),
    GameModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
