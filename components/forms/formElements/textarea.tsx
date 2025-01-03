import React from "react";
import { twMerge } from "tailwind-merge";
interface TextareaProps {
  name: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeHolder?: string;
  value: string;
  rows: number;
  minLength: number;
  maxLength: number;
  ariaLabel: string;
  showLabel?: boolean;
  update?: boolean;
  className?: string;
}

export default function Textarea({
  name,
  className,
  id,
  onChange,
  placeHolder,
  value,
  rows,
  minLength,
  maxLength,
  showLabel,
  ariaLabel,
}: TextareaProps) {
  return (
    <div className="relative flex w-full flex-col gap-1">
      {(value?.length === maxLength || (value && value.length < minLength)) && (
        <div>
          {value && value.length < minLength && (
            <h2 className={twMerge("absolute  animate-fadeIn text-xs text-red-500 transition-all duration-500 md:text-sm" , showLabel ? "right-0 top-0" : "right-0 -top-6" )}>
              At least {minLength} characters*
            </h2>
          )}
          {value && value.length === maxLength && (
            <h2 className={twMerge("absolute  animate-fadeIn text-xs text-red-500 transition-all duration-500 md:text-sm" , showLabel ? "right-0 top-0" : "right-0 -top-6" )}>
              Max {maxLength} characters*
            </h2>
          )}
        </div>
      )}
      {showLabel && (
        <label htmlFor={id} className="text-xs md:text-base">
          {name}
        </label>
      )}
      <textarea
        className={`${className} w-full resize-none rounded-md border-2 border-zinc-600 bg-transparent px-2 text-sm placeholder-zinc-500 shadow-none transition-all duration-500 scrollbar-none focus:border-2 focus:border-postBackground/50 focus:shadow-glow focus:shadow-postBackground/50 focus:outline-none md:py-2 md:text-base`}
        name={name}
        id={id}
        rows={rows}
        minLength={minLength}
        maxLength={maxLength}
        onChange={onChange}
        value={value}
        placeholder={placeHolder}
        aria-label={ariaLabel}
      ></textarea>
    </div>
  );
}
