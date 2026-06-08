import React, { forwardRef, useState } from 'react';
import { calculatePasswordStrength } from '../../lib/passwordStrength';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showStrength?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, showStrength, value: customValue, onChange, ...props }, ref) => {
    const [localValue, setLocalValue] = useState('');

    const currentPassword = customValue !== undefined ? String(customValue) : localValue;
    const strength = calculatePasswordStrength(currentPassword);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value); 
      if (onChange) onChange(e);  
    };

    const getBarColor = (score: number) => {
      if (score <= 1) return 'bg-red-500';
      if (score <= 3) return 'bg-yellow-500';
      return 'bg-green-500';
    };

    return (
      <div className="mb-4">
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          {...props}
          ref={ref}
          value={customValue} 
          onChange={handleInputChange} 
          type="password"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

        {showStrength && currentPassword.length > 0 && (
          <div className="mt-2">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${getBarColor(strength.score)}`}
                style={{ width: `${(strength.score / 4) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Password strength: <span className="font-semibold">{strength.score} / 4</span>
            </p>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
