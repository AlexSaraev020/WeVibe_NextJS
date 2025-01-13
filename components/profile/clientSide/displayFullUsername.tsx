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
      <button
        aria-label="ShowFullUsername"
        type="button"
        id="showFullUsername"
        onClick={() => setShowFullUsername(!showFullUsername)}
      >
        <IoMdArrowDropdown className="h-8 w-8 text-white/50" />
      </button>
      {showFullUsername && (
        <div className="absolute left-0 top-20 z-20 mx-2 w-fit animate-fadeIn break-all rounded-md border border-zinc-600 bg-zinc-800 p-2 text-xs transition-all duration-500 md:left-0 md:right-0 md:top-24 md:mx-auto md:text-lg">
          <h2>{username}</h2>
        </div>
      )}
    </>
  );
}
