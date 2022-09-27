import Link from 'next/link';
import { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { IUserData } from 'types/types';
import classes from './UserScene.module.scss';

type IProps = {
  user?: string;
};

type ITeam = {
  _id: string;
  team?: {
    _id: string;
    teamId?: string;
    name?: string;
  };
};

export default function UserScene({ user }: IProps) {
  const [userInfo, setUserInfo] = useState<IUserData>();
  const [teams, setTeams] = useState<ITeam[]>();
  const [isFetching, setIsFetching] = useState(false);

  const getTeams = async () => {
    try {
      const response = await fetch('/api/teams-by-user', {
        method: 'POST',
        body: JSON.stringify({
          nickname: user,
        }),
      });

      const data = await response.json();
      setTeams(data.teams);
      setUserInfo(data.userInfo);
      setIsFetching(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setIsFetching(true);
    getTeams();
  }, [user]);

  return (
    <div className={classes.container}>
      <div className={classes.loader}>
        <ClipLoader color={'gray'} loading={isFetching} size={150} />
      </div>
      {userInfo && (
        <div className={classes.info}>
          {userInfo.picture && (
            <div>
              <img src={userInfo.picture} />
            </div>
          )}
          <p className={classes.text}>
            <span className={classes.stat}>Name: </span>
            {userInfo.name}
          </p>
          <p className={classes.text}>
            <span className={classes.stat}>Email: </span>
            {userInfo.email}
          </p>
        </div>
      )}
      {teams && teams.length > 0 && (
        <div>
          <h1>Available workspaces</h1>
          {teams.map((item) => (
            <div key={item._id}>
              <Link href={`/${user}/${item.team?.name}`}>
                <a className={classes.link}>{item.team?.name}</a>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
