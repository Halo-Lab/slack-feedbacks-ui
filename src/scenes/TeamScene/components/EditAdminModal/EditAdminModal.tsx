import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Modal from '@mui/material/Modal';
import ClipLoader from 'react-spinners/ClipLoader';

import Checkbox from 'src/components/atoms/inputs/Checkbox/Checkbox';
import CustomButton from 'src/components/atoms/Button/CustomButton';
import Textarea from 'src/components/atoms/inputs/Textarea/Textarea';
import Select from 'src/components/atoms/inputs/Select/Select';

import classes from './EditAdminModal.module.scss';

type ITeam = {
  _id: string;
  name: string;
  lang: string;
  welcomeMessage: string;
};

type IFeature = {
  _id: string;
  command: string;
};

type ITeamFeatures = {
  _id: string;
  team: ITeam;
  feature: IFeature;
};

type IEditedTeamFeatures = {
  [key: string]: {
    checked: boolean;
    command: string;
  };
};

type IChecker = {
  id: string;
  checked: boolean;
};

type IEditedTeam = {
  _id: string;
  name: string;
  lang: string;
  welcomeMessage: string;
  features: IEditedTeamFeatures | Record<string, never>;
  errorText: string;
};

type IAdmin = {
  email: string;
  adminAccess: boolean;
};

type IProps = {
  handleClose: () => void;
  teamInfo: ITeam;
  adminInfo: IAdmin;
  open: boolean;
};

export default function EditAdminModal({ open, handleClose, teamInfo, adminInfo }: IProps) {
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);
  const [features, setFeatures] = useState<IFeature[]>();
  const [teamFeatures, setTeamFeatures] = useState<ITeamFeatures[]>();
  const [editedTeamData, setEditedTeamData] = useState<IEditedTeam>({
    _id: teamInfo._id,
    name: teamInfo.name,
    lang: teamInfo.lang,
    welcomeMessage: teamInfo.welcomeMessage,
    features: {},
    errorText: '',
  });

  const getFormattedTeamFeatures = (
    featuresArr: IFeature[] = [],
    teamFeaturesArr: ITeamFeatures[] = []
  ) => {
    return featuresArr.reduce((acc: IEditedTeamFeatures, featureObj: IFeature) => {
      const newFeatureObj = JSON.parse(JSON.stringify(acc));
      newFeatureObj[featureObj._id] = {
        command: featureObj.command,
        checked: !!teamFeaturesArr.find(
          (teamFeatureObj: ITeamFeatures) => teamFeatureObj.feature._id === featureObj._id
        ),
      };

      return newFeatureObj;
    }, {});
  };

  const checkInitialTeamInfo = (editedTeamObj: IEditedTeam) =>
    editedTeamObj.lang === teamInfo.lang &&
    editedTeamObj.welcomeMessage === teamInfo.welcomeMessage;

  const checkInitialTeamFeatures = (editedTeamObj: IEditedTeam) => {
    const formattedTeamFeatures = getFormattedTeamFeatures(features, teamFeatures);

    return JSON.stringify(editedTeamObj.features) === JSON.stringify(formattedTeamFeatures);
  };

  const handleEditTeamInfo = async (teamInfoObject: ITeam) => {
    try {
      const response = await fetch('/api/edit-team-info', {
        method: 'POST',
        body: JSON.stringify({
          team: {
            id: teamInfoObject._id,
            lang: teamInfoObject.lang,
            welcomeMessage: teamInfoObject.welcomeMessage,
          },
          admin: adminInfo,
        }),
      });

      const data = await response.json();
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const handleEditTeamFeatures = async (editedTeamFeaturesArr: IEditedTeamFeatures) => {
    try {
      const response = await fetch('/api/edit-team-features', {
        method: 'POST',
        body: JSON.stringify({
          teamId: teamInfo._id,
          teamFeatures: editedTeamFeaturesArr,
          admin: adminInfo,
        }),
      });

      const data = await response.json();

      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const onSave = async () => {
    setIsFetching(true);
    const editedTeamDataNew: IEditedTeam = JSON.parse(JSON.stringify(editedTeamData));

    if (!checkInitialTeamInfo(editedTeamDataNew)) {
      await handleEditTeamInfo(editedTeamDataNew);
    }

    if (!checkInitialTeamFeatures(editedTeamDataNew)) {
      await handleEditTeamFeatures(editedTeamDataNew.features);
    }

    setIsFetching(false);

    router.reload();
    handleClose();
  };

  const getFeatures = async (teamFeaturesData: ITeamFeatures[]) => {
    try {
      const response = await fetch('/api/features', {
        method: 'POST',
      });

      const data = await response.json();

      setFeatures(data.features);
      setEditedTeamData({
        ...editedTeamData,
        features: getFormattedTeamFeatures(data.features, teamFeaturesData),
      });
      setIsFetching(false);
    } catch (e) {
      console.log(e);
    }
  };

  const getTeamFeatures = async () => {
    try {
      const response = await fetch('/api/team-features', {
        method: 'POST',
        body: JSON.stringify({
          teamId: teamInfo._id,
        }),
      });

      const data = await response.json();

      setTeamFeatures(data.teamFeatures);

      await getFeatures(data.teamFeatures);
    } catch (e) {
      console.log(e);
    }
  };

  const checker = ({ checked, id }: IChecker) => {
    const newEditFeatures = JSON.parse(JSON.stringify(editedTeamData.features));
    newEditFeatures[id as keyof IEditedTeamFeatures].checked = checked;

    setEditedTeamData({
      ...editedTeamData,
      features: newEditFeatures,
    });
  };

  useEffect(() => {
    setIsFetching(true);

    getTeamFeatures();
  }, [teamInfo._id]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={classes.container}>
        <div className={classes.loader}>
          <ClipLoader color={'gray'} loading={isFetching} size={150} />
        </div>
        {teamFeatures && adminInfo.adminAccess && features && (
          <div className={classes.adminPanel}>
            <div className={classes.teamTitle}>{editedTeamData.name}</div>
            <div className={classes.language}>
              <Select
                label={'Language:'}
                id={teamInfo._id}
                inputValue={editedTeamData.lang || ''}
                children={[
                  { name: 'English', value: 'en' },
                  { name: 'Українська', value: 'ua' },
                ]}
                onChange={({ value }) => setEditedTeamData({ ...editedTeamData, lang: value })}
              ></Select>
            </div>
            <div className={classes.featuresFlag}>
              <h2 className={classes.featureTitle}>Features:</h2>
              <div className={classes.feature}>
                {Object.keys(editedTeamData.features).map((key) => (
                  <Checkbox
                    id={key}
                    label={editedTeamData.features[key].command}
                    onChange={checker}
                    checked={editedTeamData.features[key].checked}
                  ></Checkbox>
                ))}
              </div>
            </div>
            <div className={classes.welcomeMessage}>
              <h2 className={classes.messageTitle}>Welcome Message</h2>
              <p>Use {'{{tag}}'}. Tags: username, channel, link</p>
            </div>
            <Textarea
              inputValue={editedTeamData.welcomeMessage || ''}
              onChange={({ value }) =>
                setEditedTeamData({ ...editedTeamData, welcomeMessage: value })
              }
            ></Textarea>
            <div className={classes.button}>
              <CustomButton
                variant="contained"
                onClick={onSave}
                disabled={
                  checkInitialTeamInfo(editedTeamData) && checkInitialTeamFeatures(editedTeamData)
                }
                isLoading={isFetching}
              >
                Save
              </CustomButton>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
