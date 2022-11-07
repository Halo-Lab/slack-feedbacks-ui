import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import mongoose from 'lib/mongoose';

import { authOptions } from './auth/[...nextauth]';
import Feature from '../../../lib/models/feature.model';

const uri: string = process.env.MONGO_URI || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    await mongoose.connect(uri);

    const features = await Feature.find().select(['id', 'command']).lean();

    res.status(200).json({ features });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}
