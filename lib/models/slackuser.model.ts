import { Schema } from 'mongoose';
import mongoose from '../mongoose';

import { ISlackUser } from '../types/models';

const SlackUserSchema = new Schema<ISlackUser>(
  {
    slackId: {
      type: String,
      unique: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
    }
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

const SlackUser = mongoose.model<ISlackUser>('SlackUser', SlackUserSchema);

export default SlackUser;

