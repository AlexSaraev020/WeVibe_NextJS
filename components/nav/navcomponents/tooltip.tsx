import React from "react";

interface tooltipProps {
  text: string;
  className?: string;
}

export default function Tooltip({ text, className }: tooltipProps) {
  return (
    <div
      className={`${className} absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 scale-50 transform rounded-md border-2 border-sky-600 bg-black px-2 py-1 text-white opacity-0 shadow-glow-sm shadow-sky-500 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100`}
    >
      {text}
    </div>
  );
}
