import mongoose from 'lib/mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import User from 'lib/models/user.model';
import SlackUser from 'lib/models/slackuser.model';
import Team from 'lib/models/team.model';
import { unstable_getServerSession } from 'next-auth/next';
import { IUser } from 'lib/types/models';
import { authOptions } from './auth/[...nextauth]';

const uri: string = process.env.MONGO_URI || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const body = JSON.parse(req.body);
    await mongoose.connect(uri);
    const team = await Team.findOne({ name: body.name });
    const slackUsers = await SlackUser.find({ team: team?._id })
      .populate<{ child: IUser }>({
        path: 'user',
        model: User,
        select: ['name', 'nickname', 'picture', 'email'],
      })
      .select(['team'])
      .lean();

    res.status(200).json({ users: slackUsers, team });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}
