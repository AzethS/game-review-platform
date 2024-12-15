import { Module } from '@nestjs/common';
import { GameController } from './game/game.controller';
import { GameService } from './game/game.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './game/game.schema';
import { User, UserSchema } from './users/users.schema'; // Import User schema
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { PlatformsModule } from './platforms/platforms.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: User.name, schema: UserSchema }, // Register User schema explicitly
    ]),
    ReviewsModule,
    UsersModule,
    PlatformsModule,
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService, MongooseModule],
})
export class GameModule {}
