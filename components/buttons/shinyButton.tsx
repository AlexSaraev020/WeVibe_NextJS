import React from "react";
import { twMerge } from "tailwind-merge";

interface ShinyButtonProps {
  text: string;
  className?: string;
  onClick?: ( ) => void;
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
  bottomLineCollor?: string;
  topLineColor?: string;
  background?: string;
  disabled?: boolean;
}

export default function ShinyButton({
  text,
  onClick,
  type,
  disabled,
  children,
  className,
  bottomLineCollor,
  topLineColor,
  background,
}: ShinyButtonProps) {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={twMerge(
        "group relative inline-block cursor-pointer rounded-full p-[2px] leading-6 text-white no-underline transition-all duration-500 hover:shadow-glow",
        className,
      )}
    >
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span
          className={twMerge(
            "absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-postBackground/50 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
            topLineColor,
          )}
        />
      </span>
      <div
        className={twMerge(
          "relative z-10 flex items-center justify-center rounded-full font-sans ring-1 ring-white/10",
          background,
        )}
      >
        <span>{text}</span>
        {children}
      </div>
      <span
        className={twMerge(
          "absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-white/0 via-postBackground/80 to-white/0 transition-opacity duration-500 group-hover:opacity-100",
          bottomLineCollor,
        )}
      />
    </button>
  );
}
