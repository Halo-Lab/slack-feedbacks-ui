import { useState } from 'react';
import { useRouter } from 'next/router';

import Modal from '@mui/material/Modal';

import CustomButton from 'src/components/atoms/Button/CustomButton';
import Textarea from 'src/components/atoms/inputs/Textarea/Textarea';
import { IUserInfoFeedback, IUserInfoFromTo } from '../../../HomeScene/HomeScene';

import classes from './EditFeedbackModal.module.scss';

type IProps = {
  handleClose: () => void;
  userInfoFeedback: IUserInfoFeedback;
  open: boolean;
};

type IOnchange = {
  value: string;
};

type IEditedUserFeedback = {
  id: string;
  feedbackText: string;
  from: IUserInfoFromTo;
  errorText: string;
};

export default function EditFeedbackModal({ open, handleClose, userInfoFeedback }: IProps) {
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);
  const [editedUserFeedback, setEditedUserFeedback] = useState<IEditedUserFeedback>({
    id: userInfoFeedback._id,
    feedbackText: userInfoFeedback.content,
    from: userInfoFeedback.from,
    errorText: '',
  });

  const onChange = ({ value }: IOnchange) => {
    const editedUserFeedbackNew = { ...editedUserFeedback };
    editedUserFeedbackNew.feedbackText = value;
    editedUserFeedbackNew.errorText = '';

    setEditedUserFeedback(editedUserFeedbackNew);
  };

  const validate = async ({ value }: IOnchange): Promise<IEditedUserFeedback> => {
    const trimmedValue = value?.trim();
    const editedUserNew = JSON.parse(JSON.stringify(editedUserFeedback));
    editedUserNew.feedbackText = value;
    if (!trimmedValue || trimmedValue.length === 0) {
      editedUserNew.errorText = 'This field can not be empty';
    }
    return editedUserNew;
  };

  const onBlur = async ({ value }: IOnchange) => {
    const editedUserFeedbackNew = await validate({ value });

    setEditedUserFeedback(editedUserFeedbackNew);
  };

  const checkCorrect = (userObject: IEditedUserFeedback) => userObject.errorText === '';

  const checkInitial = (userObject: IEditedUserFeedback) =>
    userObject.feedbackText === userInfoFeedback.content;

  const handleEdit = async (userInfoFeedbackObject: IEditedUserFeedback) => {
    try {
      const response = await fetch('/api/edit-user-feedback', {
        method: 'POST',
        body: JSON.stringify({
          id: userInfoFeedbackObject.id,
          content: userInfoFeedbackObject.feedbackText,
          email: userInfoFeedbackObject.from.user.email,
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
    const editedUserFeedbackNew: IEditedUserFeedback = JSON.parse(
      JSON.stringify(editedUserFeedback)
    );

    const editedFeedback = await validate({
      value: editedUserFeedback.feedbackText || '',
    });

    editedUserFeedbackNew.errorText = editedFeedback.errorText;
    const isCorrect = checkCorrect(editedUserFeedbackNew);
    if (isCorrect) {
      setIsFetching(false);

      await handleEdit(editedUserFeedbackNew);

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
      <div
        className={classes.container}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1>Your Feedback To: {userInfoFeedback.to.user.name}</h1>
        <Textarea
          inputValue={editedUserFeedback.feedbackText || ''}
          onBlur={onBlur}
          onChange={onChange}
          inputError={editedUserFeedback.errorText}
        ></Textarea>
        <div className={classes.button}>
          <CustomButton
            variant="contained"
            onClick={onSave}
            disabled={!(checkCorrect(editedUserFeedback) && !checkInitial(editedUserFeedback))}
            isLoading={isFetching}
          >
            Save
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
}
