import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlatformController } from './platforms.controller';
import { PlatformService } from './platforms.service';
import { Platform, PlatformSchema } from './platforms.schema';
import {Game, GameSchema} from '../game/game.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Platform.name, schema: PlatformSchema },
      { name: Game.name, schema: GameSchema }, // Add Game schema here
    ]),
  ],
  controllers: [PlatformController],
  providers: [PlatformService],
  exports: [PlatformService],
})
export class PlatformsModule {}
