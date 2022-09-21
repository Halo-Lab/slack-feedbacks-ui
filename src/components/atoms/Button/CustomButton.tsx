import Button from '@mui/material/Button';
import { ReactNode } from 'react';

type Type = {
  children: ReactNode;
  variant?: 'text' | 'outlined' | 'contained' | undefined;
  href: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const CustomButton = ({ variant = 'contained', href, children, onClick }: Type) => {
  return (
    <Button onClick={onClick} variant={variant} href={href} color="success">
      {children || null}
    </Button>
  );
};

export default CustomButton;
