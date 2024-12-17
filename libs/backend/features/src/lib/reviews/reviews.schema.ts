import * as mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

// Review Schema Definition
export const ReviewSchema = new Schema(
  {
    userId: { 
      type: Types.ObjectId, 
      ref: 'User', 
      required: true, 
    }, // Reference to User collection

    gameId: { 
      type: Types.ObjectId, 
      ref: 'Game', 
      required: true, 
    }, // Reference to Game collection

    rating: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 5, // Rating between 0 and 5
    },

    comment: { 
      type: String, 
      maxlength: 500, // Optional comment with a maximum length
    },
  },
  { 
    versionKey: false, 
    timestamps: { createdAt: true, updatedAt: false } // Include only `createdAt`
  }
);

// Virtual ID field for cleaner access
ReviewSchema.virtual('id').get(function () {
  return this._id ? this._id.toHexString() : null;
});

// Ensure virtuals are included when converting to JSON
ReviewSchema.set('toJSON', {
  virtuals: true,
});

// Export the Review Model
export const ReviewModel = model('Review', ReviewSchema);
