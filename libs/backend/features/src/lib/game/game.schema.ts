import * as mongoose from 'mongoose';
import { GameGenre } from '@game-platform/shared/api';

const { Schema, model, Types } = mongoose;

// Game Schema Definition
export const GameSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: { 
      type: [{ type: String, enum: Object.values(GameGenre) }], 
      required: true,
    },
    platform: [{ type: Types.ObjectId, ref: 'Platform', required: true }], // Reference to Platform collection
    releaseDate: { type: Date, required: true },
    createdBy: { type: Types.ObjectId, ref: 'Company', required: true }, // Reference to Company collection
    reviews: [{ type: Types.ObjectId, ref: 'Review' }], // Reference to Review collection
  },
  { 
    versionKey: false, 
    timestamps: true // Automatically add createdAt and updatedAt fields
  }
);

// Virtual ID field for cleaner access
GameSchema.virtual('id').get(function () {
  return this._id ? this._id.toHexString() : null;
});

// Ensure virtuals are included when converting to JSON
GameSchema.set('toJSON', {
  virtuals: true,
});

// Export the Game Model
export const GameModel = model('Game', GameSchema);
