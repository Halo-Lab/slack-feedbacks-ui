import TextField from '@mui/material/TextField';
import classes from './Input.module.scss';

type IPropsOnBlur = {
  value: string;
  id: string;
};

type IProps = {
  label?: string;
  variant?: 'standard' | 'filled' | 'outlined';
  id: string;
  inputValue: string;
  onBlur: ({ value, id }: IPropsOnBlur) => void;
  onChange: ({ value, id }: IPropsOnBlur) => void;
  inputError?: string;
};

const Input = ({
  label,
  variant = 'standard',
  id,
  inputValue = '',
  onBlur,
  inputError,
  onChange,
}: IProps) => {
  return (
    <div className={classes.container}>
      <label>
        {label && <p className={classes.title}>{label}</p>}
        <TextField
          fullWidth
          id={id}
          variant={variant}
          value={inputValue}
          onChange={(ev) => {
            onChange({ value: ev.target.value, id });
          }}
          onBlur={() => {
            onBlur({ value: inputValue, id });
          }}
        />
        {inputError && <span className={classes.error}>{inputError}</span>}
      </label>
    </div>
  );
};

export default Input;
