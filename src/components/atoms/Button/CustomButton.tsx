import Button from '@mui/material/Button';
import { ReactNode } from 'react';

type IProps = {
  children: ReactNode;
  variant?: 'text' | 'outlined' | 'contained' | undefined;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  isLoading?: boolean;
};

const CustomButton = ({
  variant = 'contained',
  href,
  children,
  onClick = () => {
    console.log('empty');
  },
  disabled = false,
  isLoading = false,
}: IProps) => {
  return (
    <Button disabled={disabled} onClick={onClick} variant={variant} href={href} color="success">
      {isLoading ? <span>Loading</span> : children || null}
    </Button>
  );
};

export default CustomButton;
