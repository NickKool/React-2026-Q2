import React, { useState, useRef, useEffect } from 'react';

interface ComboboxProps {
  options: string[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  error?: string;
  id: string;
  label: string;
  name?: string;
}

export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  defaultValue = '',
  onChange,
  error,
  id,
  label,
  name,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const [internalValue, setInternalValue] = useState(value ?? defaultValue);

  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setInternalValue(value ?? defaultValue);
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);

        if (internalValue && !options.includes(internalValue)) {
          const fallback = value ?? defaultValue ?? '';
          setInternalValue(fallback);
          onChange?.(fallback);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [internalValue, options, value, defaultValue, onChange]);

  const handleSelect = (option: string) => {
    setInternalValue(option);
    onChange?.(option);
    setIsOpen(false);
  };

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(internalValue.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="text"
        value={internalValue}
        onChange={(e) => {
          setInternalValue(e.target.value);
          onChange?.(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Type country name..."
        autoComplete="off"
      />
      
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 shadow-lg border text-sm">
          {filteredOptions.map((opt) => (
            <li
              key={opt}
              onClick={() => handleSelect(opt)}
              className="cursor-pointer select-none px-4 py-2 hover:bg-blue-600 hover:text-white"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};
