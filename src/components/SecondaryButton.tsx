
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  variant?: "outline" | "default" | "destructive" | "secondary" | "ghost" | "link" | null;
  isLoading?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({ 
  children, 
  onClick, 
  type = 'button', 
  className = '', 
  disabled = false,
  variant = 'outline',
  isLoading = false,
  size = 'default'
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  );
};

export default SecondaryButton;
