import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import mongoose from 'lib/mongoose';

import { IFeature, ITeam } from '../../../lib/types/models';
import TeamFeatures from '../../../lib/models/teamfeature.model';
import Team from '../../../lib/models/team.model';
import Feature from '../../../lib/models/feature.model';

import { authOptions } from './auth/[...nextauth]';

const uri: string = process.env.MONGO_URI || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const body = JSON.parse(req.body);

    await mongoose.connect(uri);

    const teamFeatures = await TeamFeatures.find({ team: body?.teamId })
      .populate<{ child: IFeature }>({
        path: 'feature',
        model: Feature,
        select: ['id', 'command'],
      })
      .populate<{ child: ITeam }>({
        path: 'team',
        model: Team,
        select: ['id', 'name', 'lang', 'welcomeMessage'],
      })
      .select(['id', 'feature', 'team'])
      .lean();

    res.status(200).json({ teamFeatures });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}
