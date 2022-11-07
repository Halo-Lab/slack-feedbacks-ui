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
  id: string;
  checked: boolean;
};

type IEditedTeam = {
  _id: string;
  name: string;
  lang: string;
  welcomeMessage: string;
  features: IEditedTeamFeatures[];
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
    features: [],
    errorText: '',
  });

  const checkInitialTeamInfo = (editedTeamObj: IEditedTeam) =>
    editedTeamObj.lang === teamInfo.lang &&
    editedTeamObj.welcomeMessage === teamInfo.welcomeMessage;

  const checkInitialTeamFeatures = (editedTeamObj: IEditedTeam) => {
    const formattedTeamFeatures = features?.map(
      (feature: IFeature) =>
        ({
          id: feature._id,
          checked: !!teamFeatures?.find(
            (teamFeature: ITeamFeatures) => teamFeature.feature._id === feature._id
          ),
        } as IEditedTeamFeatures)
    );

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

  const handleEditTeamFeatures = async (teamFeaturesArr: IEditedTeamFeatures[]) => {
    try {
      const response = await fetch('/api/edit-team-features', {
        method: 'POST',
        body: JSON.stringify({
          teamId: teamInfo._id,
          teamFeatures: teamFeaturesArr,
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
    setIsFetching(false);

    if (!checkInitialTeamInfo(editedTeamDataNew)) {
      await handleEditTeamInfo(editedTeamDataNew);
    }

    if (!checkInitialTeamFeatures(editedTeamDataNew)) {
      await handleEditTeamFeatures(editedTeamDataNew.features);
    }

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
        features: data.features.map(
          (feature: IFeature) =>
            ({
              id: feature._id,
              checked: !!teamFeaturesData.find(
                (teamFeature: ITeamFeatures) => teamFeature.feature._id === feature._id
              ),
            } as IEditedTeamFeatures)
        ),
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

  const checker = ({ checked, id }: IEditedTeamFeatures) => {
    const featureIndex = features?.findIndex((feature) => feature._id === id);

    const copyFeatures = [...editedTeamData.features];
    copyFeatures[featureIndex || 0].id = id;
    copyFeatures[featureIndex || 0].checked = checked;

    setEditedTeamData({
      ...editedTeamData,
      features: copyFeatures,
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
                {features.map((feature) => (
                  <Checkbox
                    id={feature._id}
                    label={feature.command}
                    onChange={checker}
                    checked={
                      editedTeamData.features.find(
                        (editedFeature) => feature._id === editedFeature.id
                      )?.checked || false
                    }
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
