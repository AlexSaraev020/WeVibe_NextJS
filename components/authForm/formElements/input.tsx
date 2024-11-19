import React, { useState } from "react";
import { GoEye } from "react-icons/go";
import { GoEyeClosed } from "react-icons/go";
import { twMerge } from "tailwind-merge";

interface InputProps {
  type: string;
  name: string;
  id: string;
  placeholder: string;
  maxLength: number;
  minLength: number;
  password?: boolean;
  required: boolean;
  value?: string;
  update?: boolean;
  autoComplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({
  type,
  name,
  autoComplete,
  id,
  placeholder,
  required,
  onChange,
  value,
  maxLength,
  password,
  minLength,
  update,
}: InputProps) {
  const [hidePass, setHidePass] = useState<boolean>(false);
  return (
    <>
      <label
        htmlFor={id}
        className={twMerge(
          !update
            ? "text-sm outline-none focus:outline-none md:text-xl"
            : "text-xs md:text-base",
        )}
      >
        {name}
        {!update && <span className="text-postBackground/80">*</span>}
      </label>
      <div className="relative w-full">
        <input
          autoComplete={autoComplete}
          className="w-full rounded-md border-2 border-zinc-600 bg-black px-2 text-sm placeholder-zinc-500 shadow-none transition-all duration-500 focus:border-2 focus:border-postBackground/50 focus:shadow-glow focus:shadow-postBackground/50 focus:outline-none md:py-2 md:text-base"
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
            type="button"
            onClick={() => setHidePass(!hidePass)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {hidePass ? (
              <GoEye className="h-3 w-3 text-postBackground/80 md:h-5 md:w-5" />
            ) : (
              <GoEyeClosed className="h-3 w-3 md:h-5 md:w-5" />
            )}
          </button>
        )}
      </div>
    </>
  );
}
