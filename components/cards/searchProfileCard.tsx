import React from "react";
import Placeholder600x400 from "@/public/placeholders/600-400.png";
import Image from "next/image";

export default function SearchProfileCard() {
  return (
    <div className=" w-10/12 md:w-4/12 bg-neutral-900 border-2 border-zinc-600 shadow-glow shadow-zinc-600 hover:shadow-zinc-400 p-2 rounded-xl transition-all duration-500 animate-fadeIn hover:scale-105">
      <div className="flex items-center gap-2">
        <Image
          src={Placeholder600x400}
          alt="Placeholder"
          width={600}
          height={400}
          className="rounded-full w-8 h-8 md:w-10 md:h-10 object-cover"
        />
        <h2 className=" md:text-xl py-1 font-extrabold bg-gradient-to-r from-white via-gray-300 to-gray-200 text-center text-transparent bg-clip-text neon-text">
          Alexandru
        </h2>
      </div>
      <p className=" text-xs md:text-base text-gray-300 w-11/12 truncate py-1 pl-1">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
      </p>
    </div>
  );
}
