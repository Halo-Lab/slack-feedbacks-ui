import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import ClipLoader from 'react-spinners/ClipLoader';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import CustomButton from 'src/components/atoms/Button/CustomButton';
import { IUserInfo, IUserInfoFeedback } from '../HomeScene/HomeScene';

import classes from './LeftForMeFeedbacksScene.module.scss';

type IEditLeftFeedback = {
  [key: string]: {
    showContent: boolean;
  };
};

type IChangeShowContent = {
  id: string;
  showContentStatus: boolean;
};

export default function LeftForMeFeedbacksScene() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isFetching, setIsFetching] = useState(false);
  const [userInfo, setUserInfo] = useState<IUserInfo[]>();
  const [userInfoIndex, setUserInfoIndex] = useState(0);
  const [editLeftFeedbacks, setEditLeftFeedbacks] = useState<IEditLeftFeedback>({});

  if (!session) return null;

  const getFormattedLeftFeedbacks = (feedbacks: IUserInfoFeedback[] = []): IEditLeftFeedback => {
    return feedbacks.reduce((acc: IEditLeftFeedback, feedback: IUserInfoFeedback) => {
      const newFeedbackObj = JSON.parse(JSON.stringify(acc));
      newFeedbackObj[feedback._id] = {
        showContent: feedback.showContent,
      };

      return newFeedbackObj;
    }, {});
  };

  const getUserData = async (email: string) => {
    const response = await fetch('/api/left-for-me-feedbacks', {
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
    });

    const data = await response.json();

    setUserInfo(data);
    setEditLeftFeedbacks(getFormattedLeftFeedbacks(data[userInfoIndex].feedbacks));
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

  const changeShowContent = ({ id, showContentStatus }: IChangeShowContent) => {
    const newFeedbackObj = JSON.parse(JSON.stringify(editLeftFeedbacks));
    newFeedbackObj[id].showContent = showContentStatus;

    setEditLeftFeedbacks(newFeedbackObj);
  };

  const checkInitial = () => {
    const formattedLeftFeedbacks =
      userInfo && getFormattedLeftFeedbacks(userInfo[userInfoIndex].feedbacks);

    return JSON.stringify(editLeftFeedbacks) === JSON.stringify(formattedLeftFeedbacks);
  };

  const onSave = async () => {
    setIsFetching(true);
    const editedLeftFeedbackNew: IEditLeftFeedback = JSON.parse(JSON.stringify(editLeftFeedbacks));

    if (!checkInitial()) {
      await handleEdit(editedLeftFeedbackNew);
    }

    setIsFetching(false);

    router.reload();
  };

  const handleEdit = async (editedLeftFeedbackObject: IEditLeftFeedback) => {
    try {
      const response = await fetch('/api/edit-user-feedback', {
        method: 'POST',
        body: JSON.stringify({
          feedbacks: editedLeftFeedbackObject,
          email: userInfo && userInfo[userInfoIndex].feedbacks[0].to.user.email,
        }),
      });

      const data = await response.json();
      return data;
    } catch (e) {
      console.log(e);
    }
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
          <div className={classes.tab_container}>
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
            <div className={classes.button}>
              <CustomButton
                variant="contained"
                onClick={onSave}
                disabled={checkInitial()}
                isLoading={isFetching}
              >
                Save
              </CustomButton>
            </div>
          </div>
          {
            <div className={classes.wrapper}>
              <h3 className={classes.text}>Your feedbacks in this workspace</h3>
              {userInfo[userInfoIndex].feedbacks.map((item) => (
                <div key={item._id}>
                  <div className={classes.header_content}>
                    <h4 className={classes.text}>From {item?.from?.user?.name}</h4>
                    <img
                      className={classes.eye_image}
                      onClick={() =>
                        changeShowContent({
                          id: item._id,
                          showContentStatus: !editLeftFeedbacks[item._id].showContent,
                        })
                      }
                      src={editLeftFeedbacks[item._id].showContent ? '/eye.png' : '/eye-hide.png'}
                      alt="eye"
                    />
                  </div>
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
