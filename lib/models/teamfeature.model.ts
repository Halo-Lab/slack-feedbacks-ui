import mongoose, { Schema } from 'mongoose';

import { ITeamFeatures } from '../types/models';

const TeamFeaturesSchema = new Schema<ITeamFeatures>(
  {
    feature: {
      type: Schema.Types.ObjectId,
      ref: 'Feature',
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
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

const TeamFeatures = mongoose.model<ITeamFeatures>('TeamFeatures', TeamFeaturesSchema);

export default TeamFeatures;
