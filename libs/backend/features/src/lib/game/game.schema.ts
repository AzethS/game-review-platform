import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type GameDocument = HydratedDocument<Game>;

// Embedded Review class
class EmbeddedReview {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId;

  @Prop({ required: true, min: 0, max: 5 })
  rating!: number;

  @Prop()
  comment?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;
}

@Schema()
export class Game {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  genre!: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Platform' }], required: true }) // Reference to Platform
  platform!: Types.ObjectId[]; // Array to handle multiple platforms

  @Prop({ type: Date, default: Date.now })
  releaseDate!: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User', // Reference to User
    required: true,
  })
  createdBy!: Types.ObjectId;

  @Prop({ type: [EmbeddedReview], default: [] }) // Embedded reviews
  reviews!: EmbeddedReview[];
}

export const GameSchema = SchemaFactory.createForClass(Game);
