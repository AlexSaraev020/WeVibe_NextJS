import React from 'react'

interface ShinyButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
}
export default function ShinyButton({ text, onClick,type }: ShinyButtonProps) {
  return (
    <button type={type} onClick={onClick} className="relative group w-9/12 inline-flex overflow-hidden rounded-md p-[1px] focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-slate-50">
      <span className="absolute inset-[-1000%] group-hover:animate-[spin_2s_linear_infinite] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#d1d5db_0%,#3f3f46_50%,#d1d5db_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-black p-2 text-lg font-bold text-white backdrop-blur-3xl">
        {text}
      </span>
    </button>
  )
}



