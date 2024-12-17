import * as mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

// Contact Information Sub-schema
const ContactInformationSchema = new Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: [/^\+?[0-9\- ]{7,15}$/, 'Invalid phone number format'],
    }, // Phone number with basic validation

    email: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Invalid email format',
      ],
    }, // Email with regex validation

    website: {
      type: String,
      trim: true,
    }, // Optional website field
  },
  { _id: false } // Prevents MongoDB from assigning a unique ID to sub-documents
);

// Company Schema
export const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    }, // Company name

    location: {
      type: String,
      required: true,
      trim: true,
    }, // Company location

    description: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    }, // Company description

    contactInformation: {
      type: ContactInformationSchema,
      required: true,
    }, // Embedded ContactInformation

    gamesCreated: [
      {
        type: Types.ObjectId,
        ref: 'Game',
        default: [],
      },
    ], // References to Game collection
  },
  {
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: true }, // Adds createdAt and updatedAt fields
  }
);

// Virtual ID field for cleaner access
CompanySchema.virtual('id').get(function () {
  return this._id ? this._id.toHexString() : null;
});

// Ensure virtuals are included when converting to JSON
CompanySchema.set('toJSON', {
  virtuals: true,
});

// Export the Company Model
export const CompanyModel = model('Company', CompanySchema);
