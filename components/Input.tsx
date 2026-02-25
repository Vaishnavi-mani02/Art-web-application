
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, className = '', ...props }) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-brand-text mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full bg-white border border-brand-border rounded-md shadow-sm px-3 py-2 text-brand-text placeholder-rose-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary ${className}`}
        {...props}
      />
    </div>
  );
};
