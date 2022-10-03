import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import ClipLoader from 'react-spinners/ClipLoader';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import classes from './MyFeedbacksScene.module.scss';

import { IUserInfo, IUserInfoFeedback } from '../HomeScene/HomeScene';
import EditFeedbackModal from './components/EditFeedbackModal/EditFeedbackModal';

export default function MyFeedbacksScene() {
  const { data: session } = useSession();
  const [isFetching, setIsFetching] = useState(false);
  const [userInfo, setUserInfo] = useState<IUserInfo[]>();
  const [userInfoIndex, setUserInfoIndex] = useState(0);
  const [isEditFeedbackModalOpen, setIsEditFeedbackModalOpen] = useState(false);
  const [userInfoFeedback, setUserInfoFeedback] = useState<IUserInfoFeedback>();

  if (!session) return null;

  const getUserData = async (email: string) => {
    try {
      const response = await fetch('/api/my-feedbacks', {
        method: 'POST',
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();
      setUserInfo(data);
      setIsFetching(false);
    } catch (e) {
      console.log(e);
    }
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
      {userInfoFeedback && isEditFeedbackModalOpen && (
        <EditFeedbackModal
          userInfoFeedback={userInfoFeedback}
          handleClose={() => setIsEditFeedbackModalOpen(false)}
          open={isEditFeedbackModalOpen}
        />
      )}
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
              <h3 className={classes.text}>You left feedbacks in this workspace</h3>
              {userInfo[userInfoIndex].feedbacks.map((item) => (
                <div key={item._id}>
                  <h4 className={classes.text}>To {item.to.user.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p className={classes.text}>{item.content}</p>
                    <img
                      onClick={() => {
                        setUserInfoFeedback(item);
                        setIsEditFeedbackModalOpen(true);
                      }}
                      style={{
                        width: '20px',
                        height: '20px',
                        marginLeft: '15px',
                        cursor: 'pointer',
                      }}
                      src="/edit-pencil.png"
                      alt="edit-pencil"
                    />
                  </div>
                </div>
              ))}
            </div>
          }
        </>
      )}
    </div>
  );
}
