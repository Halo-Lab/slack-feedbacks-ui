import mongoose from 'lib/mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import User from 'lib/models/user.model';
import SlackUser from 'lib/models/slackuser.model';
import Team from 'lib/models/team.model';
import { ITeam } from 'lib/types/models';

const uri: string = process.env.MONGO_URI || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = JSON.parse(req.body);
    await mongoose.connect(uri);
    const user = await User.findOne({ nickname: body.nickname });
    const slackUsers = await SlackUser.find({ user: user?._id })
      .populate<{ child: ITeam }>({
        path: 'team',
        model: Team,
        select: ['name', 'teamId'],
      })
      .select(['team'])
      .lean();

    res.status(200).json({ teams: slackUsers, userInfo: user });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}
