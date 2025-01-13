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
    <div className={twMerge("h-fit w-full", className)}>
      <p
        className={`min-h-fit w-full break-all text-xs transition-all duration-1000 ease-in-out md:text-sm ${
          truncate ? "max-h-24 overflow-hidden" : "max-h-screen"
        }`}
      >
        {text.length > 100 && truncate ? (
          <>
            {text.slice(0, 100)}...
            <button
              type="button"
              aria-label="ShowMoreTextButton"
              id="showMoreTextButton"
              onClick={() => setTruncate(false)}
              className="ml-4 text-xs italic text-white/60 md:text-sm"
            >
              more
            </button>
          </>
        ) : (
          <>
            {text}
            {text.length > 100 && (
              <button
                type="button"
                aria-label="ShowLessTextButton"
                id="showLessTextButton"
                onClick={() => setTruncate(true)}
                className="ml-4 text-xs italic text-white/60 md:text-sm"
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
