"use client";
import React, { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

interface DisplayFullUsernameProps {
  username: string;
}
export default function DisplayFullUsername({
  username,
}: DisplayFullUsernameProps) {
  const [showFullUsername, setShowFullUsername] = useState<boolean>(false);
  return (
    <>
      <button onClick={() => setShowFullUsername(!showFullUsername)}>
        <IoMdArrowDropdown className="text-white/50 h-8 w-8" />
      </button>
      {showFullUsername && (
        <div className="absolute transition-all break-all w-fit mx-2 z-20 duration-500 animate-fadeIn bg-zinc-800 border border-zinc-600 text-xs md:text-lg p-2 rounded-md left-0 top-20 md:top-24 md:left-0 md:right-0 md:mx-auto">
          <h2>{username}</h2>
        </div>
      )}
    </>
  );
}
