import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ClipLoader from 'react-spinners/ClipLoader';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
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
  }[];
};

export default function HomeScene() {
  const { data: session } = useSession();
  const [isFetching, setIsFetching] = useState(false);
  const [userInfo, setUserInfro] = useState<IUserInfo[]>();
  const [userInfoIndex, setUserInfoIndex] = useState(0);

  if (!session) return null;

  const getUserData = async (email: string) => {
    const response = await fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
    });

    const data = await response.json();
    setUserInfro(data);
    setIsFetching(false);
  };

  useEffect(() => {
    if (session && session.user?.email) {
      setIsFetching(true);
      getUserData(session.user.email);
    }
  }, [session]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setUserInfoIndex(newValue);
  };

  return (
    <div className={classes.container}>
      <ClipLoader color={'gray'} loading={isFetching} size={150} />
      {userInfo && !userInfo[userInfoIndex] && !isFetching && (
        <p className={classes.text}>Sorry, You don't have feedbacks in any workspaces yet</p>
      )}
      {userInfo && userInfo[userInfoIndex] && (
        <>
          <Tabs
            value={userInfoIndex}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            {userInfo.map((user) => (
              <Tab key={user._id} label={user.team.name} />
            ))}
          </Tabs>
          {
            <div className={classes.wrapper}>
              <h3 className={classes.text}>Your feedbacks in this workspace</h3>
              {userInfo[userInfoIndex].feedbacks.map((item) => (
                <div key={item._id}>
                  <h4 className={classes.text}>From {item?.from?.user?.name}</h4>
                  <p className={classes.text}>{item.content}</p>
                </div>
              ))}
            </div>
          }
        </>
      )}
    </div>
  );
}
