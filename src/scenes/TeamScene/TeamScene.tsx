import { Link } from '@mui/material';
import { useState, useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import classes from './TeamScene.module.scss';

type IProps = {
  id?: string;
};

type ITeamUser = {
  _id: string;
  user?: {
    _id: string;
    email: string;
    name: string;
    nickname: string;
    picture: string;
  };
};

type ITeam = {
  _id: string;
  name: string;
};

export default function TeamScene({ id }: IProps) {
  if (!id) return null;
  const [users, setUsers] = useState<ITeamUser[]>();
  const [team, setTeam] = useState<ITeam>();
  const [isFetching, setIsFetching] = useState(false);

  const getUsers = async () => {
    try {
      const response = await fetch('/api/team-users', {
        method: 'POST',
        body: JSON.stringify({
          name: id,
        }),
      });

      const data = await response.json();
      setUsers(data.users);
      setTeam(data.team);
      setIsFetching(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setIsFetching(true);
    getUsers();
  }, [id]);

  return (
    <div className={classes.container}>
      <div className={classes.loader}>
        <ClipLoader color={'gray'} loading={isFetching} size={150} />
      </div>
      {users && team && (
        <div>
          <h1>Users in the {team.name} workspace</h1>
          {users.map((item) => (
            <Link href={`/${item.user?.nickname}`}>
              <div className={classes.user}>
                <img src={item.user?.picture || ''} />
                <p>{item.user?.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
