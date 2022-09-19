import Button from '@mui/material/Button';
import { ReactNode } from 'react';

type Type = {
  children: ReactNode;
  variant?: 'text' | 'outlined' | 'contained' | undefined;
  href: string;
};

const CustomButton = ({ variant = 'contained', href, children }: Type) => {
  return (
    <Button variant={variant} href={href}>
      {children || null}
    </Button>
  );
};

export default CustomButton;
