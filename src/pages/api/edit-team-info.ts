import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import mongoose from 'lib/mongoose';
import Team from '../../../lib/models/team.model';

import { authOptions } from './auth/[...nextauth]';

const uri: string = process.env.MONGO_URI || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = JSON.parse(req.body);

    const session = await unstable_getServerSession(req, res, authOptions);

    if (!body.team.id) {
      return res.status(400).json({ error: 'ID is required' });
    }
    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (session?.user?.email !== body.admin.email || !body.admin.adminAccess) {
      return res.status(401).json({ error: 'Access denied' });
    }

    await mongoose.connect(uri);

    const team = await Team.updateOne(
      { _id: body.team.id },
      {
        lang: body.team.lang,
        welcomeMessage: body.team.welcomeMessage,
      }
    );

    res.status(200).json({ teamInfo: team });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}
