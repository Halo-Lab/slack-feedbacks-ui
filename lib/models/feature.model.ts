import mongoose, { Schema } from 'mongoose';

import { IFeature } from '../types/models';

const FeatureSchema = new Schema<IFeature>(
  {
    command: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

const Feature = mongoose.model<IFeature>('Feature', FeatureSchema);

export default Feature;
