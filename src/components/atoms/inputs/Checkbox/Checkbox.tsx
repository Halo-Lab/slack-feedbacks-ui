import { FormControlLabel } from '@mui/material';
import CheckboxInput from '@mui/material/Checkbox';

import classes from './Checkbox.module.scss';

type IPropsOnBlur = {
  checked: boolean;
  id: string;
};

type IProps = {
  label?: string;
  id: string;
  checked: boolean;
  onChange: ({ checked, id }: IPropsOnBlur) => void;
};

const Checkbox = ({ label, id, checked = false, onChange }: IProps) => {
  return (
    <div className={classes.container}>
      <FormControlLabel
        label={label}
        control={
          <CheckboxInput
            id={id}
            checked={checked}
            onChange={(ev) => {
              onChange({ checked: ev.target.checked, id });
            }}
          />
        }
      />
    </div>
  );
};

export default Checkbox;
