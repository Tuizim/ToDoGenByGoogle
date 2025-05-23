import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: 'bg-primary-DEFAULT hover:bg-sky-600 dark:bg-primary-dark dark:hover:bg-sky-500 text-white focus:ring-primary-DEFAULT',
    secondary: 'bg-secondary-light dark:bg-secondary-dark hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white focus:ring-secondary-dark dark:focus:ring-secondary-light', // Kept secondary, can be adjusted
    danger: 'bg-danger-light dark:bg-danger-dark hover:bg-red-600 dark:hover:bg-red-500 text-white focus:ring-danger-dark dark:focus:ring-danger-light',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-700 text-text_primary-light dark:text-text_primary-dark focus:ring-slate-500 dark:focus:ring-slate-400 border border-border_color-light dark:border-border_color-dark',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;