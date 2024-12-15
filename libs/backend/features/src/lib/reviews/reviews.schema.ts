import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema()
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: Types.ObjectId; // Reference to User collection

  @Prop({ type: Types.ObjectId, ref: 'Game', required: true })
  gameId!: Types.ObjectId; // Reference to Game collection

  @Prop({ required: true, min: 0, max: 5 })
  rating!: number;

  @Prop()
  comment?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;
}

const ReviewSchema = SchemaFactory.createForClass(Review);

// Map virtual 'id' safely to `_id`
ReviewSchema.virtual('id').get(function () {
  return this._id?.toHexString();
});

// Include virtuals in JSON and Object outputs
ReviewSchema.set('toJSON', { virtuals: true });
ReviewSchema.set('toObject', { virtuals: true });

export { ReviewSchema };
