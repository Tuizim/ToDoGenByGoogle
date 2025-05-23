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
  const baseStyles = "font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-all duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: 'bg-teal-500 hover:bg-teal-600 dark:bg-teal-400 dark:hover:bg-teal-500 text-white focus:ring-teal-500',
    secondary: 'bg-secondary-light dark:bg-secondary-dark hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white focus:ring-secondary-dark dark:focus:ring-secondary-light',
    danger: 'bg-danger-light dark:bg-danger-dark hover:bg-red-600 dark:hover:bg-red-500 text-white focus:ring-danger-dark dark:focus:ring-danger-light',
    ghost: 'bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700/60 text-text_primary-light dark:text-text_primary-dark focus:ring-teal-500/70 dark:focus:ring-teal-400/70 border border-border_color-light dark:border-border_color-dark',
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