import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <div className={`md-input-container ${className}`}>
        <input 
          ref={ref}
          className="md-input" 
          placeholder=" " 
          {...props} 
        />
        <label className="md-input-label">{label}</label>
      </div>
    );
  }
);

Input.displayName = 'Input';
