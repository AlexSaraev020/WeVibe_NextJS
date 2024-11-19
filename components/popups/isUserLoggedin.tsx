"use client";
import React, { useEffect, useState } from "react";
import Alert from "./alert";

export default function IsUserLoggedinPromptNotification() {
  const [message, setMessage] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      setMessage("You are logged in!");
      setShowAlert(true);
    } else {
      setMessage("");
    }
  }, []);

  return (
    <div className="fixed bottom-5 right-0 flex w-full items-center justify-center pb-10 md:bottom-0 md:justify-end md:pb-0">
      {showAlert && (
        <Alert
          loggedIn
          className="relative bg-black"
          message={message}
          setShowAlert={setShowAlert}
        />
      )}
    </div>
  );
}
