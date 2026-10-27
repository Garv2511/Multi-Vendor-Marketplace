'use client';

import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium uppercase tracking-[0.15em] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-[11px] py-2 px-3.5 min-h-[38px] gap-2',
    md: 'text-[12px] py-3.5 px-6 min-h-[46px] gap-2.5',
    lg: 'text-[13px] py-4 px-8 min-h-[52px] gap-3',
  };

  const variantStyles = {
    primary: 'bg-black text-white hover:bg-neutral-800 active:bg-neutral-900 border border-black shadow-sm',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 border border-neutral-200/80',
    outline: 'bg-transparent text-neutral-900 hover:bg-neutral-100 active:bg-neutral-200 border border-neutral-300',
    ghost: 'bg-transparent text-neutral-800 hover:bg-neutral-100/70 active:bg-neutral-200/70',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <span
          className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"
          role="status"
          aria-label="Loading"
        />
      ) : (
        leftIcon && <span className="inline-flex shrink-0 text-base">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="inline-flex shrink-0 text-base">{rightIcon}</span>
      )}
    </button>
  );
};
