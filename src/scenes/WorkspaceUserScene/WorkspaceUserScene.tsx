import { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ClipLoader from 'react-spinners/ClipLoader';
import CustomButton from 'src/components/atoms/Button/CustomButton';
import classes from './WorkspaceUserScene.module.scss';

type IProps = {
  user?: string;
  workspace?: string;
};

type IFeedbackFrom = {
  content: string;
  _id: string;
  to: {
    _id: string;
    user: {
      name: string;
    };
  };
};

type IFeedbackTo = {
  content: string;
  _id: string;
  from: {
    _id: string;
    user: {
      name: string;
    };
  };
};

export default function WorkspaceUserScene({ user, workspace }: IProps) {
  const [isFetching, setIsFetching] = useState(false);
  const [feedbcksTo, setFeedbacksTo] = useState<IFeedbackTo[]>();
  const [feedbcksFrom, setFeedbacksFrom] = useState<IFeedbackFrom[]>();
  const [index, setIndex] = useState(0);
  const [isError, setIsError] = useState(false);

  const getData = async () => {
    try {
      const response = await fetch('/api/feedbacks-user-workspace', {
        method: 'POST',
        body: JSON.stringify({
          nickname: user,
          team: workspace,
        }),
      });

      const data = await response.json();
      if (data.error) {
        setIsError(true);
      } else {
        setFeedbacksTo(data.feedbacksTo);
        setFeedbacksFrom(data.feedbacksFrom);
      }
      setIsFetching(false);
    } catch (e) {
      console.log(e);
      setIsError(true);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    setIsError(false);
    setIsFetching(true);
    getData();
  }, [user, workspace]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setIndex(newValue);
  };

  return (
    <div className={classes.container}>
      {isError && <p>Some error ocurred</p>}
      <div className={classes.loader}>
        <ClipLoader color={'gray'} loading={isFetching} size={150} />
      </div>

      {(feedbcksTo || feedbcksFrom) && (
        <div className={classes.path}>
          <CustomButton variant="text" href={`/${user}`}>
            <p>Back to user's profile</p>
          </CustomButton>

          <Tabs
            value={index}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            {['Feedbacks left by user', 'Feedbacks left for user'].map((user) => (
              <Tab key={user} label={user} />
            ))}
          </Tabs>
          {index === 0 && (
            <div>
              {feedbcksFrom?.map((item) => (
                <div key={item._id}>
                  <h4 className={classes.text}>To {item?.to?.user?.name}</h4>
                  <p className={classes.text}>{item.content}</p>
                </div>
              ))}
            </div>
          )}
          {index === 1 && (
            <div>
              {feedbcksTo?.map((item) => (
                <div key={item._id}>
                  <h4 className={classes.text}>From {item?.from?.user?.name}</h4>
                  <p className={classes.text}>{item.content}</p>
                </div>
              ))}
            </div>
          )}
          {((index === 0 && !feedbcksFrom?.length) || (index === 1 && !feedbcksTo?.length)) && (
            <p>No feedbacks at this section yet</p>
          )}
        </div>
      )}
    </div>
  );
}
