import React from "react";

interface ShinyButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
}
export default function ShinyButton({ text, onClick, type }: ShinyButtonProps) {
  return (
    <div className="relative group w-9/12">
      <div className="relative w-full h-14 opacity-90 overflow-hidden rounded-xl bg-black z-10">
        <div className="absolute z-10 -translate-x-44 group-hover:translate-x-[30rem] ease-in transistion-all duration-700 h-full w-44 bg-gradient-to-r from-sky-700 to-white/10 opacity-30 -skew-x-12"></div>

        <div className="absolute flex items-center justify-center text-white z-[1] opacity-100 rounded-2xl inset-0.5 bg-black">
          <button
            onClick={onClick}
            type={type}
            name="text"
            className="input font-semibold text-lg h-full opacity-90 w-full px-16 py-3 rounded-xl bg-black"
          >
            {text}
          </button>
        </div>
        <div className="absolute duration-500 transition-all group-hover:animate-spin w-full h-[100px] bg-gradient-to-r from-white via-sky-500 to-sky-500 group-hover:from-sky-500 group-hover:to-sky-500 blur-[30px]"/>
      </div>
    </div>
  );
}
