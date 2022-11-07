import TextareaAutosize from '@mui/material/TextareaAutosize';

import classes from './Textarea.module.scss';

type IPropsOnBlur = {
  value: string;
};

type IProps = {
  label?: string;
  inputValue: string;
  onBlur?: ({ value }: IPropsOnBlur) => void;
  onChange: ({ value }: IPropsOnBlur) => void;
  inputError?: string;
};

const Textarea = ({ label, inputValue = '', onBlur, inputError, onChange }: IProps) => {
  return (
    <div className={classes.container}>
      <label>
        {label && <p className={classes.title}>{label}</p>}
        <TextareaAutosize
          className={classes.textarea}
          value={inputValue}
          onChange={(ev) => {
            onChange({ value: ev.target.value });
          }}
          onBlur={() => {
            return onBlur ? onBlur({ value: inputValue }) : null;
          }}
        />
        {inputError && <span className={classes.error}>{inputError}</span>}
      </label>
    </div>
  );
};

export default Textarea;
