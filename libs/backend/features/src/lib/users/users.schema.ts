import * as mongoose from 'mongoose';
import { Role } from '@game-platform/shared/api';

export const AddressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  }, { _id: false }); // _id is set to false to prevent MongoDB from assigning a unique ID to each address

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emailAddress: { type: String, required: true },
  password: { type: String, required: true }, // Store hashed passwords
  birthDate: { type: Date, required: true },
  address: { type: AddressSchema, required: true },
  role: { type: String, enum: Object.values(Role), required: true },
  ownedGames: [{ type: String }],
}, { versionKey: false });

export const UserModel = mongoose.model('User', UserSchema);