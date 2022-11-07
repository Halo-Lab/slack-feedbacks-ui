import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { Link } from '@mui/material';
import ClipLoader from 'react-spinners/ClipLoader';

import EditAdminModal from './components/EditAdminModal/EditAdminModal';
import { IUserData } from '../../../types/types';

import classes from './TeamScene.module.scss';

type IProps = {
  id?: string;
};

type ITeamUser = {
  _id: string;
  role: 'admin' | 'user';
  user?: {
    _id: string;
    email: string;
    name: string;
    nickname: string;
    picture: string;
  };
};

type ITeam = {
  id: string;
  name: string;
  lang: string;
  welcomeMessage: string;
};

type IAdmin = {
  email: string;
  adminAccess: boolean;
};

export default function TeamScene({ id }: IProps) {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const [admin, setAdmin] = useState<IAdmin>();
  const [users, setUsers] = useState<ITeamUser[]>();
  const [team, setTeam] = useState<ITeam>();
  const [isFetching, setIsFetching] = useState(false);
  const [isEditFeedbackModalOpen, setIsEditFeedbackModalOpen] = useState(false);

  if (!session || !id) return null;

  const getUser = async () => {
    try {
      const response = await fetch('/api/get-user-by-email', {
        method: 'POST',
        body: JSON.stringify({
          email: session.user?.email,
        }),
      });

      const data = await response.json();

      return data.userInfo;
    } catch (e) {
      console.log(e);
    }
  };

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

      const user = await getUser();

      getAdminAccess(user, data.users);
    } catch (e) {
      console.log(e);
    }
  };

  const getAdminAccess = (currentUser: IUserData, usersArr: ITeamUser[]) => {
    const adminAccess = usersArr.find((userObj) => userObj.user?._id === currentUser._id);

    setAdmin({
      email: currentUser.email,
      adminAccess: adminAccess?.role === 'admin',
    });

    setIsFetching(false);
  };

  useEffect(() => {
    setIsFetching(true);

    getUsers();
  }, [id]);

  return (
    <div className={classes.container}>
      {team && admin && admin.adminAccess && isEditFeedbackModalOpen && (
        <EditAdminModal
          teamInfo={{ ...team, _id: team.id }}
          adminInfo={admin}
          handleClose={() => setIsEditFeedbackModalOpen(false)}
          open={isEditFeedbackModalOpen}
        />
      )}
      <div className={classes.loader}>
        <ClipLoader color={'gray'} loading={isLoading || isFetching} size={150} />
      </div>
      {team && admin && admin.adminAccess && (
        <button
          className={classes.adminEdit}
          onClick={() => {
            setTeam(team);
            setIsEditFeedbackModalOpen(true);
          }}
        >
          Admin Edit
        </button>
      )}
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
