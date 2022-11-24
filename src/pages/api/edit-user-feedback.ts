import { unstable_getServerSession } from 'next-auth/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import mongoose from 'lib/mongoose';
import Feedback from 'lib/models/feedback.model';

import { authOptions } from './auth/[...nextauth]';

const uri: string = process.env.MONGO_URI || '';

type IEditFeedback = {
  content?: string;
  showContent?: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = JSON.parse(req.body);

    const session = await unstable_getServerSession(req, res, authOptions);

    if (!body.email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (Object.keys(body.feedbacks).length === 0) {
      return res.status(400).json({ error: 'feedbacks object is required' });
    }
    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (session?.user?.email !== body.email) {
      return res.status(401).json({ error: 'Access denied' });
    }

    await mongoose.connect(uri);

    for (const [id, feedbackObj] of Object.entries(body.feedbacks)) {
      await Feedback.updateOne({ _id: id }, { ...(feedbackObj as IEditFeedback) });
    }

    res.status(200).json({ feedbacks: body.feedbacks });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}
