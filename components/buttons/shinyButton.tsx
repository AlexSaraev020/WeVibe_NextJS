import React from "react";
import { twMerge } from "tailwind-merge";

interface ShinyButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
  bottomLineCollor?: string;
  topLineColor?: string;
  textStyle?: string;
}

export default function ShinyButton({
  text,
  onClick,
  type,
  children,
  className,
  bottomLineCollor,
  topLineColor,
  textStyle,
}: ShinyButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={twMerge(
        "group relative inline-block cursor-pointer rounded-full bg-slate-800 p-[2px] leading-6 text-white no-underline shadow-2xl shadow-zinc-900 transition-all duration-500 hover:shadow-glow hover:shadow-postBackground/50",
        className,
      )}
    >
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className={twMerge("absolute inset-0 rounded-full bg-gradient-to-r from-white/0 via-postBackground/50 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100", topLineColor)} />
      </span>
      <div className={twMerge("relative z-10 flex items-center justify-center space-x-2 rounded-full bg-gradient-to-tr from-black via-neutral-900 to-black px-6 py-3 font-sans ring-1 ring-white/10", textStyle)}>
        <span>{text}</span>
        {children}
      </div>
      <span className={twMerge("absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-white/0 via-postBackground/80 to-white/0 transition-opacity duration-500 group-hover:opacity-100", bottomLineCollor)} />
    </button>
  );
}
