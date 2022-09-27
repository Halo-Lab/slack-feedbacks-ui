import { useState } from 'react';
import Modal from '@mui/material/Modal';
import { IUserData } from 'types/types';
import Input from 'src/components/atoms/inputs/Input/Input';
import CustomButton from 'src/components/atoms/Button/CustomButton';
import { useRouter } from 'next/router';
import classes from './EditModal.module.scss';

type IProps = {
  handleClose: () => void;
  user: IUserData;
  open: boolean;
};

type IOnchange = {
  id: string;
  value: string;
};

type IEditedUser = {
  [key: string]: {
    title: string;
    value?: string;
    id: string;
    errorText: string;
  };
};

export default function EditModal({ open, handleClose, user }: IProps) {
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);
  const [editedUser, setEditedUser] = useState<IEditedUser>({
    name: {
      title: 'Name',
      value: user.name,
      id: 'name',
      errorText: '',
    },
    picture: {
      title: 'Profile avatar',
      value: user.picture,
      id: 'picture',
      errorText: '',
    },
    nickname: {
      title: 'Nickname',
      value: user.nickname,
      id: 'nickname',
      errorText: '',
    },
  });

  const onChange = ({ id, value }: IOnchange) => {
    const editedUserNew = { ...editedUser };
    editedUserNew[id as keyof IEditedUser].value = value;
    editedUserNew[id as keyof IEditedUser].errorText = '';

    setEditedUser(editedUserNew);
  };

  const checkIsNicknameTaken = async (value: string) => {
    try {
      const response = await fetch('/api/check-nickname', {
        method: 'POST',
        body: JSON.stringify({
          nickname: value,
          email: user.email,
        }),
      });

      const data = await response.json();
      return data?.isAvailable;
    } catch (e) {
      console.log(e);
    }
  };

  const validate = async ({ id, value }: IOnchange) => {
    const trimmedValue = value?.trim();
    const editedUserNew = JSON.parse(JSON.stringify(editedUser));
    editedUserNew[id as keyof IEditedUser].value = value;
    if (!trimmedValue || trimmedValue.length === 0) {
      editedUserNew[id as keyof IEditedUser].errorText = 'This field can not be empty';
      return editedUserNew;
    }
    if (trimmedValue.length < 5) {
      editedUserNew[id as keyof IEditedUser].errorText = 'Min length is 5 chars';
      return editedUserNew;
    }
    if (id === editedUser.nickname.id) {
      if (value.length !== value?.replace(/\s/g, '').length) {
        editedUserNew[id as keyof IEditedUser].errorText = 'Nickname can not contain whitespaces';
        return editedUserNew;
      }
      if (
        value.length !== value?.replace(/\s/g, '').replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '').length
      ) {
        editedUserNew[id as keyof IEditedUser].errorText = 'Nickname can not contain spec chars';
        return editedUserNew;
      }
      const isNicknameAvailable = await checkIsNicknameTaken(trimmedValue);
      if (!isNicknameAvailable) {
        editedUserNew[id as keyof IEditedUser].errorText = 'Sorry this nickname is already taken';
        return editedUserNew;
      }
    }
    return editedUserNew;
  };

  const onBlur = async ({ id, value }: IOnchange) => {
    const editedUserNew = await validate({ id, value });
    setEditedUser(editedUserNew);
  };

  const checkCorrect = (userObject: IEditedUser) => {
    const keys = Object.keys(userObject);
    const isCorrect = keys.every((key) => userObject[key].errorText === '');
    return isCorrect;
  };

  const checkInitial = (userObject: IEditedUser) => {
    const keys = Object.keys(userObject);
    const isInitial = keys.every((key) => userObject[key].value === user[key as keyof IUserData]);
    return isInitial;
  };

  const handleEdit = async (userObject: IEditedUser) => {
    try {
      const response = await fetch('/api/edit-user-info', {
        method: 'POST',
        body: JSON.stringify({
          email: user?.email,
          nickname: userObject.nickname.value,
          picture: userObject.picture.value,
          name: userObject.name.value,
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
    const keys = Object.keys(editedUser);
    const editedUserNew = JSON.parse(JSON.stringify(editedUser));
    for (const key of keys) {
      const edited = await validate({ id: editedUser[key].id, value: editedUser[key].value || '' });
      editedUserNew[key] = edited[key];
    }
    const isCorrect = checkCorrect(editedUserNew);
    if (isCorrect) {
      setIsFetching(false);
      await handleEdit(editedUserNew);
      router.reload();
      handleClose();
    } else {
      setIsFetching(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={classes.container}>
        <Input
          variant="standard"
          id={editedUser.name.id}
          label={editedUser.name.title}
          inputValue={editedUser.name.value || ''}
          onChange={onChange}
          onBlur={onBlur}
          inputError={editedUser.name.errorText}
        />
        <Input
          variant="standard"
          id={editedUser.nickname.id}
          label={editedUser.nickname.title}
          inputValue={editedUser.nickname.value || ''}
          onChange={onChange}
          onBlur={onBlur}
          inputError={editedUser.nickname.errorText}
        />
        <div>
          <img className={classes.image} src={editedUser.picture.value || ''} />
          <Input
            variant="standard"
            id={editedUser.picture.id}
            inputValue={editedUser.picture.value || ''}
            onChange={onChange}
            onBlur={onBlur}
            inputError={editedUser.picture.errorText}
          />
        </div>
        <div className={classes.button}>
          <CustomButton
            variant="contained"
            onClick={onSave}
            disabled={!(checkCorrect(editedUser) && !checkInitial(editedUser))}
            isLoading={isFetching}
          >
            Save
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
}
