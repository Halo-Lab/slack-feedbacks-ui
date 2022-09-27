import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ClipLoader from 'react-spinners/ClipLoader';
import Link from 'next/link';
import { IUserData } from 'types/types';
import CustomButton from 'src/components/atoms/Button/CustomButton';
import classes from './HomeScene.module.scss';
import EditModal from './components/EditModal/EditModal';

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
  const [isFetching, setIsFetching] = useState(false);
  const [userData, setUserData] = useState<IUserData>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!session) return null;

  const getUser = async () => {
    try {
      const response = await fetch('/api/get-user-by-email', {
        method: 'POST',
        body: JSON.stringify({
          email: session.user?.email,
        }),
      });

      const data = await response.json();
      setUserData(data.userInfo);
      setIsFetching(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUser();
    setIsFetching(true);
  }, []);

  return (
    <div className={classes.container}>
      {userData && isEditModalOpen && (
        <EditModal
          user={userData}
          handleClose={() => setIsEditModalOpen(false)}
          open={isEditModalOpen}
        />
      )}
      <div className={classes.loader}>
        <ClipLoader color={'gray'} loading={isLoading || isFetching} size={150} />
      </div>
      {session && session.user && userData && (
        <>
          <div className={classes.wrapper}>
            <div>
              <img
                className={classes.image}
                loading="eager"
                src={userData.picture || ''}
                alt="User photo"
              />
              <p className={classes.text}>
                <span className={classes.stat}>Name: </span>
                {userData.name}
              </p>
              <p className={classes.text}>
                <span className={classes.stat}>Email: </span>
                {userData.email}
              </p>
              <p className={classes.text}>
                <span className={classes.stat}>Nickname: </span>
                {userData.nickname}
              </p>
              <div className={classes.box}>
                <p className={classes.text}>
                  <span className={classes.stat}>Public URL: </span>
                  {`${process.env.NEXT_PUBLIC_BASE_URL}/${userData.nickname}`}
                </p>
                <span
                  className={classes.copy}
                  role="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_BASE_URL}/${userData.nickname}`
                    );
                    setIsCopied(true);
                  }}
                >
                  <img src={isCopied ? '/checkmark.svg' : '/copy.svg'} />
                </span>
              </div>
              <CustomButton variant="text" onClick={() => setIsEditModalOpen(true)}>
                Edit profile
              </CustomButton>
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
