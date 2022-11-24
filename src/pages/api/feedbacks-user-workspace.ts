import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';

import mongoose from 'lib/mongoose';
import User from 'lib/models/user.model';
import SlackUser from 'lib/models/slackuser.model';
import Feedback from 'lib/models/feedback.model';
import Team from 'lib/models/team.model';
import { ISlackUser } from 'lib/types/models';

import { authOptions } from './auth/[...nextauth]';

const uri: string = process.env.MONGO_URI || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = JSON.parse(req.body);

    await mongoose.connect(uri);

    const user = await User.findOne({ nickname: body.nickname });

    const team = await Team.findOne({ name: body.team });

    if (!team) {
      return res.status(400).json({ error: 'No such team' });
    }

    const slackUser = await SlackUser.findOne({ team: team?._id, user: user?._id });

    const session = await unstable_getServerSession(req, res, authOptions);

    const filterObj = {} as { showContent?: boolean };

    if (!session || !session.user || !session.user.email) {
      filterObj.showContent = true;
    } else {
      const currentUser = await User.findOne({ email: session.user.email });

      if (!currentUser) {
        filterObj.showContent = true;
      } else {
        const currentSlackUser = await SlackUser.findOne({
          team: team?._id,
          user: currentUser._id,
        });

        if (!currentSlackUser) {
          filterObj.showContent = true;
        }
      }
    }

    const feedbacksTo = await Feedback.find({ to: slackUser?._id })
      .where(filterObj)
      .populate<{ child: ISlackUser }>({
        path: 'from',
        select: ['slackId', 'user'],
        populate: {
          path: 'user',
          select: ['name'],
        },
      })
      .sort({ createdAt: -1 })
      .select(['content', 'from', 'createdAt']);

    const feedbacksFrom = await Feedback.find({ from: slackUser?._id })
      .where(filterObj)
      .populate<{ child: ISlackUser }>({
        path: 'to',
        select: ['slackId', 'user'],
        populate: {
          path: 'user',
          select: ['name'],
        },
      })
      .sort({ createdAt: -1 })
      .select(['content', 'to', 'createdAt']);

    res.status(200).json({ feedbacksTo, feedbacksFrom });
  } catch (err) {
    res.status(400).json({ error: err });
  }
}
