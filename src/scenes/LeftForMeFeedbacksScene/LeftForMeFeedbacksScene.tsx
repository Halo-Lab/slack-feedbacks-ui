import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ClipLoader from 'react-spinners/ClipLoader';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import classes from './LeftForMeFeedbacksScene.module.scss';
import { IUserInfo } from '../HomeScene/HomeScene';

export default function LeftForMeFeedbacksScene() {
  const { data: session } = useSession();
  const [isFetching, setIsFetching] = useState(false);
  const [userInfo, setUserInfro] = useState<IUserInfo[]>();
  const [userInfoIndex, setUserInfoIndex] = useState(0);

  if (!session) return null;

  const getUserData = async (email: string) => {
    const response = await fetch('/api/left-for-me-feedbacks', {
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
      <div className={classes.loader}>
        <ClipLoader color={'gray'} loading={isFetching} size={150} />
      </div>
      {userInfo && !userInfo[userInfoIndex] && !isFetching && (
        <p className={classes.text}>Sorry, You don't have feedbacks in any workspaces yet</p>
      )}
      {userInfo && userInfo[userInfoIndex] && !isFetching && (
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
