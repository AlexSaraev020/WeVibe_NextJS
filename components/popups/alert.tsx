"use client";
import { useAlert } from "@/contexts/alert/alertContext";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export default function Alert() {
  const [progress, setProgress] = useState<number>(0);
  const { error, message, setMessage } = useAlert();
  useEffect(() => {
    if (message) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return prev;
          }
          return prev + 100 / 30;
        });
      }, 100);
      const timeout = setTimeout(() => {
        setMessage(undefined);
        setProgress(0);
      }, 3000);
      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [message]);
  return (
    <div className="fixed z-50 bottom-2 flex w-full items-center justify-center md:justify-end">
      {message && message?.length > 0 && (
        <div
          className={twMerge(
            " z-50 flex min-w-60 max-w-80 animate-fadeIn flex-col items-center justify-center gap-2 rounded-xl border-2 bg-transparent p-2 transition-all duration-500 md:py-4",
            error
              ? "border-red-500 border-red-500/80 text-red-100 shadow-red-500"
              : "border-sky-500 border-sky-500/80 text-sky-100 shadow-sky-500",
          )}
        >
          <h2 className="md:text-md text-xs font-semibold">{message}</h2>
          <div
            className={twMerge(
              "relative h-[0.2rem] w-full rounded-full",
              error ? "bg-red-200" : "bg-sky-200",
            )}
          >
            <div
              className={twMerge(
                "absolute h-full rounded-full bg-red-500",
                error ? "bg-red-500" : "bg-sky-500",
              )}
              style={{ width: `${progress}%`, transition: "width 0.1s ease" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
