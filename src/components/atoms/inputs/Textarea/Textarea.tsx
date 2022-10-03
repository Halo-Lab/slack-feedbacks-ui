import TextareaAutosize from '@mui/material/TextareaAutosize';

import classes from './Textarea.module.scss';

type IPropsOnBlur = {
  value: string;
};

type IProps = {
  label?: string;
  inputValue: string;
  onBlur: ({ value }: IPropsOnBlur) => void;
  onChange: ({ value }: IPropsOnBlur) => void;
  inputError?: string;
};

const Textarea = ({ label, inputValue = '', onBlur, inputError, onChange }: IProps) => {
  return (
    <div className={classes.container}>
      <label>
        {label && <p className={classes.title}>{label}</p>}
        <TextareaAutosize
          value={inputValue}
          onChange={(ev) => {
            onChange({ value: ev.target.value });
          }}
          onBlur={() => {
            onBlur({ value: inputValue });
          }}
          style={{
            width: '350px',
            height: '150px',
            border: '1px solid #1976d2',
            padding: '10px',
          }}
        />
        {inputError && <span className={classes.error}>{inputError}</span>}
      </label>
    </div>
  );
};

export default Textarea;
