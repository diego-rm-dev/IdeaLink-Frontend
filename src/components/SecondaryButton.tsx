
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const SecondaryButton = ({ 
  children, 
  className, 
  variant = 'outline', 
  size = 'default',
  ...props 
}: SecondaryButtonProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'border-idea-primary text-idea-primary hover:bg-idea-light hover:text-idea-primary',
        'transition-all duration-200 ease-in-out',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SecondaryButton;
