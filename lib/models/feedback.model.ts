import { Schema } from 'mongoose';
import mongoose from '../mongoose';
import { IFeedback } from '../types/models';

const FeedbackSchema = new Schema<IFeedback>(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: 'SlackUser',
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'SlackUser',
    },
    content: {
      type: String,
      default: ''
    },
    anonymous: {
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

const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export default Feedback;
