'use client';

import React, { InputHTMLAttributes } from 'react';
import { Check } from 'react-bootstrap-icons';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  rightLabel?: React.ReactNode;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  rightLabel,
  checked,
  onChange,
  className = '',
  disabled,
  ...props
}) => {
  const checkboxId = id || 'checkbox-input';

  return (
    <div className={`flex items-center justify-between gap-3 select-none ${className}`}>
      <label
        htmlFor={checkboxId}
        className={`group flex items-center gap-2.5 cursor-pointer text-xs text-neutral-700 tracking-wide ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span className="relative flex items-center justify-center w-4 h-4 border border-neutral-400 bg-white group-hover:border-black transition-colors">
          <input
            id={checkboxId}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only"
            {...props}
          />
          {checked && (
            <span className="w-full h-full bg-black flex items-center justify-center text-white">
              <Check className="w-3.5 h-3.5 stroke-[1.5]" />
            </span>
          )}
        </span>
        <span className="text-[12px] text-neutral-800 font-normal">{label}</span>
      </label>

      {rightLabel && (
        <div className="shrink-0 text-[11px] font-medium tracking-wider text-neutral-500">
          {rightLabel}
        </div>
      )}
    </div>
  );
};
