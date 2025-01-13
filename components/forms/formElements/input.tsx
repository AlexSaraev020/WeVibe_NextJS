import React, { useState } from "react";
import { GoEye } from "react-icons/go";
import { GoEyeClosed } from "react-icons/go";

interface InputProps {
  type: string;
  name: string;
  id: string;
  placeholder: string;
  maxLength: number;
  minLength: number;
  password?: boolean;
  required: boolean;
  value: string;
  update?: boolean;
  autoComplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ariaLabel: string;
  labelDisplay?: boolean;
  className?: string;
}

export default function FormInput({
  type,
  name,
  autoComplete,
  id,
  placeholder,
  required,
  ariaLabel,
  onChange,
  className,
  value,
  maxLength,
  password,
  labelDisplay,
  minLength,
  update,
}: InputProps) {
  const [hidePass, setHidePass] = useState<boolean>(false);
  return (
    <div className="relative flex w-full flex-col gap-1">
      <div className="h-6">
        {(value?.length === maxLength ||
          (value && value.length < minLength)) && (
          <div>
            {value && value.length < minLength && (
              <h2 className="absolute right-0 top-0 animate-fadeIn text-xs text-red-500 transition-all duration-500 md:text-sm">
                At least {minLength} characters*
              </h2>
            )}
            {value && value.length === maxLength && (
              <h2 className="absolute right-0 top-0 animate-fadeIn text-xs text-red-500 transition-all duration-500 md:text-sm">
                Max {maxLength} characters*
              </h2>
            )}
          </div>
        )}
        {labelDisplay && (
          <label htmlFor={id} className="text-xs md:text-base">
            {name}
            {!update && <span className="text-postBackground/80">*</span>}
          </label>
        )}
      </div>
      <div className="relative w-full">
        <input
          aria-label={ariaLabel}
          autoComplete={autoComplete}
          className={`${className} w-full rounded-md border-2 border-zinc-600 bg-transparent px-2 text-sm placeholder-zinc-500 shadow-none transition-all duration-500 focus:border-2 focus:border-postBackground/50 focus:shadow-glow focus:shadow-postBackground/50 focus:outline-none md:py-2 md:text-base`}
          type={password ? (hidePass ? "text" : "password") : type}
          name={name}
          id={id}
          value={value}
          maxLength={maxLength}
          minLength={minLength}
          placeholder={placeholder}
          required={required}
          onChange={onChange}
        />
        {password && (
          <button
            aria-label="TogglePasswordVisibility"
            id="togglePasswordVisibility"
            type="button"
            onClick={() => setHidePass(!hidePass)}
            className="absolute  h-full w-6 md:w-8 right-0 top-1/2 -translate-y-1/2"
          >
            {hidePass ? (
              <GoEye className="h-3 w-3 text-postBackground/80 md:h-5 md:w-5" />
            ) : (
              <GoEyeClosed className="h-3 w-3 md:h-5 md:w-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
