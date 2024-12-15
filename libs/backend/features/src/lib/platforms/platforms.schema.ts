import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type PlatformDocument = HydratedDocument<Platform>;

@Schema()
export class Platform {
  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop({ type: [Types.ObjectId], ref: 'Game', default: [] }) // Many-to-many relationship
  games!: Types.ObjectId[];
}

const PlatformSchema = SchemaFactory.createForClass(Platform);

// Map `_id` to `id`
PlatformSchema.virtual('id').get(function () {
  return this._id ? this._id.toHexString() : null;
});

// Ensure `virtuals` are included in JSON responses
PlatformSchema.set('toJSON', { virtuals: true });
export { PlatformSchema };
