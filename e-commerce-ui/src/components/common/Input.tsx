'use client';

import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
  hint?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  id,
  label,
  error,
  rightElement,
  hint,
  className = '',
  containerClassName = '',
  required,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, '-') : undefined);
  const errorId = inputId ? `${inputId}-error` : undefined;
  const hintId = inputId ? `${inputId}-hint` : undefined;

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor={inputId}
            className="block text-[10px] font-semibold tracking-[0.16em] uppercase text-neutral-600 select-none"
          >
            {label} {required && <span className="text-neutral-900">*</span>}
          </label>
        </div>
      )}

      <div className="relative flex items-center">
        <input
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          required={required}
          className={`w-full bg-[#f3f3f1] border ${
            error ? 'border-red-600' : 'border-neutral-200 hover:border-neutral-300'
          } text-neutral-900 text-xs sm:text-sm px-3.5 py-3 pr-10 rounded-none transition-colors duration-150 placeholder:text-neutral-400 placeholder:text-xs placeholder:tracking-wider focus:outline-none focus:bg-white focus:border-neutral-900 ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 flex items-center justify-center text-neutral-500 pointer-events-auto">
            {rightElement}
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-[11px] text-red-600 font-medium">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1 text-[11px] text-neutral-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
};
