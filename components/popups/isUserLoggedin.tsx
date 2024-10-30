"use client";
import React, { useEffect, useState } from "react";
import Alert from "./alert";

export default function IsUserLoggedin() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    setIsUserLoggedIn(isLoggedIn || "");
  }, []);

  useEffect(() => {
    if (isUserLoggedIn) {
      setShowAlert(true);
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
        setIsUserLoggedIn("");
        sessionStorage.removeItem("isLoggedIn");
        setShowAlert(false);
        setProgress(0);
      }, 3000);
      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
      };
    }
  }, [isUserLoggedIn]);

  return (
    <div className="fixed bottom-0 right-0">
      {showAlert && <Alert message={isUserLoggedIn} progress={progress} />}
    </div>
  );
}
