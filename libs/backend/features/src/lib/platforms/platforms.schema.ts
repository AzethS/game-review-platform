import * as mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

// Platform Schema Definition
export const PlatformSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true, 
    }, // Platform name, required

    description: { 
      type: String, 
      maxlength: 500, // Optional description with a max length
    }, // Platform description

    games: [{ 
      type: Types.ObjectId, 
      ref: 'Game', 
      default: [], 
    }], // References to Game collection
  },
  { 
    versionKey: false, 
    timestamps: { createdAt: true, updatedAt: true } // Add both createdAt and updatedAt
  }
);

// Virtual ID field for cleaner access
PlatformSchema.virtual('id').get(function () {
  return this._id ? this._id.toHexString() : null;
});

// Ensure virtuals are included when converting to JSON
PlatformSchema.set('toJSON', {
  virtuals: true,
});

// Export the Platform Model
export const PlatformModel = model('Platform', PlatformSchema);
