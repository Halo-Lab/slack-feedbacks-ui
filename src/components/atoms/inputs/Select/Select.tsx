import SelectInput from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import classes from './Select.module.scss';

type IPropsOnBlur = {
  value: string;
  id: string;
};

type IProps = {
  label?: string;
  variant?: 'standard' | 'filled' | 'outlined';
  id: string;
  inputValue: string;
  onChange: ({ value, id }: IPropsOnBlur) => void;
  children: { value: string; name: string }[];
};

const Select = ({
  label,
  variant = 'standard',
  id,
  inputValue = '',
  onChange,
  children,
}: IProps) => {
  return (
    <div className={classes.container}>
      <label>
        {label && <p className={classes.title}>{label}</p>}
        <SelectInput
          id={id}
          variant={variant}
          value={inputValue}
          onChange={(ev) => {
            onChange({ value: ev.target.value, id });
          }}
        >
          {children.map((child) => (
            <MenuItem value={child.value}>{child.name}</MenuItem>
          ))}
        </SelectInput>
      </label>
    </div>
  );
};

export default Select;
