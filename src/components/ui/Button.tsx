import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outlined' | 'ghost';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const baseClass = 'md-btn';
  let variantClass = '';
  
  if (variant === 'primary') {
    variantClass = 'md-btn-primary';
  } else if (variant === 'outlined') {
    variantClass = 'md-btn-outlined';
  }

  return (
    <button className={`${baseClass} ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
