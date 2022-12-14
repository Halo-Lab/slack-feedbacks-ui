import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import mongoose from 'lib/mongoose';
import Team from 'lib/models/team.model';
import User from 'lib/models/user.model';
import Feedback from 'lib/models/feedback.model';
import SlackUser from 'lib/models/slackuser.model';
import { ISlackUser, ITeam } from 'lib/types/models';

import { authOptions } from './auth/[...nextauth]';

const uri: string = process.env.MONGO_URI || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = JSON.parse(req.body);

    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (session?.user?.email !== body.email) {
      return res.status(401).json({ error: 'Access denied' });
    }

    await mongoose.connect(uri);

    const user = await User.findOne({ email: body.email });

    const slackUsers = await SlackUser.find({ user: user?._id })
      .populate<{ child: ITeam }>({
        path: 'team',
        model: Team,
        select: ['name', 'teamId'],
      })
      .select(['slackId', 'user', 'team'])
      .lean();

    const slackIds = slackUsers.map((user) => user._id);

    const feedbacks = await Feedback.find({
      from: { $in: slackIds },
    })
      .populate<{ child: ISlackUser }>({
        path: 'to',
        select: ['slackId', 'user'],
        populate: {
          path: 'user',
          select: ['name', 'email'],
        },
      })
      .populate<{ child: ISlackUser }>({
        path: 'from',
        select: ['slackId', 'user'],
        populate: {
          path: 'user',
          select: ['name', 'email'],
        },
      })
      .sort({ createdAt: -1 })
      .select(['content', 'from', 'to', 'showContent'])
      .lean();

    const slackUsersWithFeedbacks = slackUsers.map((slackUser) => {
      const feedbackForUser = feedbacks.filter(
        (feedback) => feedback.from.slackId === slackUser?.slackId
      );
      return {
        ...slackUser,
        feedbacks: feedbackForUser,
      };
    });

    res.status(200).json(slackUsersWithFeedbacks);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}
