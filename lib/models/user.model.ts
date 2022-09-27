import { Schema } from 'mongoose';
import mongoose from '../mongoose';
import { IUser } from '../types/models';

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
      unique: true
    },
    nickname: {
      type: String,
      unique: true
    },
    picture: {
      type: String,
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

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
