import mongoose from 'lib/mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import User from 'lib/models/user.model';

const uri: string = process.env.MONGO_URI || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = JSON.parse(req.body);
    await mongoose.connect(uri);
    const currentUser = await User.findOne({ email: body.email });
    const user = await User.findOne({ nickname: body.nickname });
    let isAvailable = !user;
    if (currentUser?.nickname === body.nickname) {
      isAvailable = true;
    }
    res.status(200).json({ isAvailable });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}
