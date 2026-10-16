import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className = '', id, ...props }: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-[12px] font-semibold text-[#161714] dark:text-[#F2F1EC] mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3.5 py-2 rounded-lg border text-[13px] bg-[#FFFFFF] dark:bg-[#161815] text-[#161714] dark:text-[#F2F1EC] placeholder-[#9A9A92] transition-colors focus:outline-none focus:ring-1.5 focus:ring-[#B87A22] focus:border-[#B87A22] disabled:opacity-50 disabled:bg-[#F5F4EF] ${
          error ? 'border-[#C0392B] focus:ring-[#C0392B]' : 'border-[#E7E5DF] dark:border-[#2A2C27]'
        } ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-[11.5px] text-[#6B6A63] dark:text-[#9A9A92] mt-1">{hint}</p>}
      {error && <p className="text-[11.5px] text-[#C0392B] mt-1 font-medium">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, className = '', id, rows = 3, ...props }: TextareaProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-[12px] font-semibold text-[#161714] dark:text-[#F2F1EC] mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`w-full px-3.5 py-2 rounded-lg border text-[13px] bg-[#FFFFFF] dark:bg-[#161815] text-[#161714] dark:text-[#F2F1EC] placeholder-[#9A9A92] transition-colors focus:outline-none focus:ring-1.5 focus:ring-[#B87A22] focus:border-[#B87A22] disabled:opacity-50 ${
          error ? 'border-[#C0392B] focus:ring-[#C0392B]' : 'border-[#E7E5DF] dark:border-[#2A2C27]'
        } ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-[11.5px] text-[#6B6A63] dark:text-[#9A9A92] mt-1">{hint}</p>}
      {error && <p className="text-[11.5px] text-[#C0392B] mt-1 font-medium">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string | number; label: string }[];
}

export function Select({ label, error, hint, options, className = '', id, ...props }: SelectProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-[12px] font-semibold text-[#161714] dark:text-[#F2F1EC] mb-1.5">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`w-full px-3.5 py-2 rounded-lg border text-[13px] bg-[#FFFFFF] dark:bg-[#161815] text-[#161714] dark:text-[#F2F1EC] transition-colors focus:outline-none focus:ring-1.5 focus:ring-[#B87A22] focus:border-[#B87A22] ${
          error ? 'border-[#C0392B]' : 'border-[#E7E5DF] dark:border-[#2A2C27]'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && !error && <p className="text-[11.5px] text-[#6B6A63] dark:text-[#9A9A92] mt-1">{hint}</p>}
      {error && <p className="text-[11.5px] text-[#C0392B] mt-1 font-medium">{error}</p>}
    </div>
  );
}

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Switch({ checked, onChange, label, description, disabled = false }: SwitchProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      {(label || description) && (
        <div className="flex-1">
          {label && <p className="text-[13px] font-semibold text-[#161714] dark:text-[#F2F1EC]">{label}</p>}
          {description && <p className="text-[12px] text-[#6B6A63] dark:text-[#9A9A92] mt-0.5">{description}</p>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#B87A22]/40 disabled:opacity-50 disabled:cursor-not-allowed ${
          checked ? 'bg-[#B87A22]' : 'bg-[#DCDAD2] dark:bg-[#30332C]'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
