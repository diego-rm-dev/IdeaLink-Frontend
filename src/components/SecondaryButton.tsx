
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean; // Added this property to match PrimaryButton
}

const SecondaryButton = ({ 
  children, 
  className, 
  variant = 'outline', 
  size = 'default',
  isLoading = false, // Added default value
  ...props 
}: SecondaryButtonProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'border-idea-primary text-idea-primary hover:bg-idea-light hover:text-idea-primary',
        'transition-all duration-200 ease-in-out',
        isLoading && 'opacity-70 cursor-not-allowed', // Added loading state styling
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-idea-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SecondaryButton;
