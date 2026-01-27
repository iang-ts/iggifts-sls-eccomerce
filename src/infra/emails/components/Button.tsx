import { Button as EmailButton } from '@react-email/button';
import React from 'react';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  href,
  children,
  variant = 'primary',
}) => {
  const className =
    variant === 'primary'
      ? 'bg-red-600 text-white px-8 py-3 rounded-lg font-semibold text-center no-underline inline-block hover:bg-red-700 transition-colors'
      : 'bg-white text-red-600 border-2 border-red-600 px-8 py-3 rounded-lg font-semibold text-center no-underline inline-block hover:bg-red-50 transition-colors';

  return (
    <EmailButton href={href} className={className}>
      {children}
    </EmailButton>
  );
};
