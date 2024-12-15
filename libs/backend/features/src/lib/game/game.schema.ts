import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GameGenre } from '@game-platform/shared/api';

export type GameDocument = HydratedDocument<Game>;

@Schema()
export class Game {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, type: String, enum: GameGenre }) // Explicitly specify the type
  genre!: GameGenre;

  @Prop({ required: true })
  platform!: string;

  @Prop({ type: Date, required: true })
  releaseDate!: Date;

  @Prop({ required: true })
  createdBy!: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);
