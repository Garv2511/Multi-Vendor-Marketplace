import React, { type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  id,
  required,
  rightElement,
  className = '',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300 uppercase select-none"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        <input
          id={inputId}
          required={required}
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm transition-colors duration-150 outline-none
            ${error
              ? 'border-red-500 text-red-900 dark:text-red-200 bg-red-50/30 dark:bg-red-950/20 focus:ring-2 focus:ring-red-500/20'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-600/20'
            }
            ${rightElement ? 'pr-11' : ''}
            disabled:opacity-60 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-2.5 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400 mt-0.5">
          {error}
        </p>
      )}

      {!error && hint && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;

