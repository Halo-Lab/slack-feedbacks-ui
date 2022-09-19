import { Schema } from 'mongoose';
import mongoose from '../mongoose';

import { ITeam } from '../types/models';

const TeamSchema = new Schema<ITeam>(
  {
    teamId: {
      type: String,
      unique: true
    },
    name: {
      type: String
    },
    lang: {
      type: String,
      enum : ['en','ua'],
      default: 'en'
    },
    onboardingStep: {
      type: Number
    },
    channelId: {
      type: String
    },
    isCompletedOnboarding: {
      type: Boolean,
      default: false
    },
    isStartedOnboarding: {
      type: Boolean,
      default: false
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

const Team = mongoose.model<ITeam>('Team', TeamSchema);

export default Team;

