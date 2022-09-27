import mongoose from 'lib/mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import User from 'lib/models/user.model';
import SlackUser from 'lib/models/slackuser.model';
import Team from 'lib/models/team.model';
import { unstable_getServerSession } from 'next-auth/next';
import { ITeam } from 'lib/types/models';
import { authOptions } from './auth/[...nextauth]';

const uri: string = process.env.MONGO_URI || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    await mongoose.connect(uri);
    const user = await User.findOne({ email: session.user?.email });
    const slackUsers = await SlackUser.find({ user: user?._id })
      .populate<{ child: ITeam }>({
        path: 'team',
        model: Team,
        select: ['name', 'teamId'],
      })
      .select(['team'])
      .lean();

    res.status(200).json({ teams: slackUsers });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}
