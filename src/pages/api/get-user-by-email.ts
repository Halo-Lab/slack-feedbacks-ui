import mongoose from 'lib/mongoose';
import { unstable_getServerSession } from 'next-auth/next';
import type { NextApiRequest, NextApiResponse } from 'next';
import User from 'lib/models/user.model';
import { authOptions } from './auth/[...nextauth]';

const uri: string = process.env.MONGO_URI || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = JSON.parse(req.body);
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ error: 'Not authenticated' });
    }
    if (session?.user?.email !== body.email) {
      res.status(401).json({ error: 'Access denied' });
    }
    await mongoose.connect(uri);
    const user = await User.findOne({ email: body.email });
    res.status(200).json({ userInfo: user });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}
