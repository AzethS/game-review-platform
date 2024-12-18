import * as mongoose from 'mongoose';
import { Role } from '@game-platform/shared/api';

const { Schema, model, Types } = mongoose;

// Address Schema Definition
export const AddressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false } // Prevent MongoDB from assigning a unique ID to each address
);

// User Schema Definition
export const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true }, // Trim for consistent formatting
    emailAddress: { type: String, required: true, unique: true, lowercase: true }, // Ensure email is unique and lowercase
    password: { type: String, required: true }, // Store hashed passwords
    birthDate: { type: Date, required: true },
    address: { type: AddressSchema, required: true },
    role: { type: String, enum: Object.values(Role), required: true }, // Enum for role validation
    ownedGames: [
      {
        type: Types.ObjectId,
        ref: 'Game',
        default: [],
      },
    ], // References to the Game collection
    reviewsGiven: [
      {
        type: Types.ObjectId,
        ref: 'Review',
        default: [],
      },
    ], // References to the Review collection
  },
  {
    versionKey: false, // Disable the version key (__v)
    timestamps: { createdAt: true, updatedAt: true }, // Add timestamps for createdAt and updatedAt
  }
);

// Virtual ID field for cleaner access
UserSchema.virtual('id').get(function () {
  return this._id ? this._id.toHexString() : null;
});

// Ensure virtuals are included when converting to JSON
UserSchema.set('toJSON', {
  virtuals: true,
});

// Export the User Model
export const UserModel = model('User', UserSchema);
