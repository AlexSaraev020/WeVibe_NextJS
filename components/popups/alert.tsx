import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface AlertProps {
  message: string | undefined;
  error?: boolean;
  setShowAlert: (showAlert: boolean) => void;
  className?: string;
  loggedIn?: boolean;
  setMessage?: (message: string | undefined) => void;
}
export default function Alert({
  message,
  setShowAlert,
  error,
  loggedIn,
  className,
  setMessage,
}: AlertProps) {
  const [progress, setProgress] = useState<number>(0);

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
        setMessage && setMessage(undefined);
        {
          loggedIn && sessionStorage.removeItem("isLoggedIn");
        }
        setShowAlert(false);
        setProgress(0);
      }, 3000);
      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [message]);
  return (
    <div
      className={twMerge(
        "fixed bottom-2 flex min-w-60 max-w-80 animate-fadeIn flex-col items-center justify-center gap-2 rounded-xl border-2 bg-transparent p-2 transition-all duration-500 md:bottom-5 md:right-5 md:py-4",
        error
          ? "border-red-500 border-red-500/80 text-red-100 shadow-red-500"
          : "border-sky-500 border-sky-500/80 text-sky-100 shadow-sky-500",
        className,
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
  );
}
