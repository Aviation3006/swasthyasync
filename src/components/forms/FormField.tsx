import React from 'react';

interface FormFieldProps {
  label: string;
  id?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  error,
  helperText,
  required = false,
  children,
  className = ''
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      <label htmlFor={id} className="text-xs font-semibold text-slate-700 flex items-center gap-1">
        {label}
        {required && <span className="text-rose-500 font-bold">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};
