import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#B87A22]/40 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeClasses = {
    sm: 'text-[12px] px-2.5 py-1.5 gap-1.5',
    md: 'text-[13px] px-3.5 py-2 gap-2',
    lg: 'text-[14px] px-4.5 py-2.5 gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-[#B87A22] hover:bg-[#A36919] text-[#FFFFFF] shadow-sm font-semibold',
    secondary:
      'bg-[#F0EFEA] hover:bg-[#E6E4DD] text-[#161714] border border-[#E0DED6] dark:bg-[#20221E] dark:hover:bg-[#282B25] dark:text-[#F2F1EC] dark:border-[#30332C]',
    outline:
      'bg-transparent hover:bg-[#F5F4EF] text-[#161714] border border-[#DCDAD2] dark:hover:bg-[#1A1C18] dark:text-[#F2F1EC] dark:border-[#2E302A]',
    danger:
      'bg-[#C0392B] hover:bg-[#A83225] text-white shadow-sm font-semibold',
    ghost:
      'bg-transparent hover:bg-[#F5F4EF] text-[#6B6A63] hover:text-[#161714] dark:hover:bg-[#1A1C18] dark:text-[#9A9A92] dark:hover:text-[#F2F1EC]',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
}
