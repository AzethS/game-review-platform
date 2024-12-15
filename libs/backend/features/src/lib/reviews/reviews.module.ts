import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewController } from './reviews.controller';
import { ReviewService } from './reviews.service';
import { Review, ReviewSchema } from './reviews.schema';
import { Game, GameSchema } from '../game/game.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema },
      { name: Game.name, schema: GameSchema },
    ]), // Connect schema to MongoDB
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService], // Optional: Export service incase other modules need access
})
export class ReviewsModule {}
