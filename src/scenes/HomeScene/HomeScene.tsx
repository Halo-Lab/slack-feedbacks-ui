import Image from 'next/image';
import { useSession } from 'next-auth/react';
import ClipLoader from 'react-spinners/ClipLoader';
import Link from 'next/link';
import classes from './HomeScene.module.scss';

export type IUserInfo = {
  _id: string;
  slackId: string;
  team: {
    _id: string;
    teamId: string;
    name: string;
  };
  feedbacks: {
    _id: string;
    content: string;
    from: {
      slackId: string;
      user: {
        _id: string;
        name: string;
      };
    };
    to: {
      slackId: string;
      user: {
        _id: string;
        name: string;
      };
    };
  }[];
};

export default function HomeScene() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  if (!session) return null;

  return (
    <div className={classes.container}>
      <div className={classes.loader}>
        <ClipLoader color={'gray'} loading={isLoading} size={150} />
      </div>
      {session && session.user && (
        <>
          <div className={classes.wrapper}>
            <div>
              <Image
                loading="eager"
                src={session.user?.image || ''}
                alt="User photo"
                width={300}
                height={300}
              />
              <p className={classes.text}>
                <span className={classes.stat}>Name: </span>
                {session.user?.name}
              </p>
              <p className={classes.text}>
                <span className={classes.stat}>Email: </span>
                {session.user?.email}
              </p>
            </div>
            <div>
              <Link href={'/left-for-me-feedbacks'}>
                <a className={classes.link}>View feedbacks left for me</a>
              </Link>
              <Link href={'/my-feedbacks'}>
                <a className={classes.link}>View my feedbacks</a>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
