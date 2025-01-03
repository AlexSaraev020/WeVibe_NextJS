"use client";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";

interface LongTextTruncateProps {
  text: string;
  className?: string;
}

export default function Long_Text_Truncate({
  text,
  className,
}: LongTextTruncateProps) {
  const [truncate, setTruncate] = useState<boolean>(true);

  return (
    <div className={twMerge("w-full h-fit", className)}>
      <p
        className={`break-all w-full min-h-fit text-xs md:text-sm transition-all duration-1000 ease-in-out ${
          truncate ? "max-h-24 overflow-hidden" : "max-h-screen"
        }`}
      >
        {text.length > 100 && truncate ? (
          <>
            {text.slice(0, 100)}...
            <button
              onClick={() => setTruncate(false)}
              className="italic text-xs md:text-sm text-white/60 ml-4"
            >
              more
            </button>
          </>
        ) : (
          <>
            {text}
            {text.length > 100 && (
              <button
                onClick={() => setTruncate(true)}
                className="italic text-xs md:text-sm text-white/60 ml-4"
              >
                less
              </button>
            )}
          </>
        )}
      </p>
    </div>
  );
}
