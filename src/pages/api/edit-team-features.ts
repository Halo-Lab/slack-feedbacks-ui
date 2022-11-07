import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import mongoose from 'lib/mongoose';
import TeamFeatures from '../../../lib/models/teamfeature.model';

import { authOptions } from './auth/[...nextauth]';

const uri: string = process.env.MONGO_URI || '';

type IEditedTeamFeatures = {
  id: string;
  checked: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = JSON.parse(req.body);

    const session = await unstable_getServerSession(req, res, authOptions);

    if (!body.teamId) {
      return res.status(401).json({ error: 'teamId is required' });
    }
    if (body.teamFeatures.find((el: IEditedTeamFeatures) => !el.id)) {
      return res.status(400).json({ error: 'Feature field id is required' });
    }
    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (session?.user?.email !== body.admin.email || !body.admin.adminAccess) {
      return res.status(401).json({ error: 'Access denied' });
    }

    await mongoose.connect(uri);

    for (const teamFeature of body.teamFeatures) {
      const { id, checked } = teamFeature as IEditedTeamFeatures;

      if (checked) {
        await TeamFeatures.updateOne(
          { team: body.teamId, feature: id },
          {
            team: body.teamId,
            feature: id,
          },
          { upsert: true }
        );
      } else {
        await TeamFeatures.deleteOne({ team: body.teamId, feature: id });
      }
    }

    res.status(200).json({ teamFeatures: body.teamFeatures });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}
