import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Game } from '../game/game.schema'; // Import Game schema

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  username!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Game' }], default: [] }) // References to Game
  games!: Types.ObjectId[];
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function () {
  return this._id ? this._id.toHexString() : null;
});

UserSchema.set('toJSON', {
  virtuals: true,
});

export { UserSchema };
