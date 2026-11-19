"use client";
import { useAlert } from "@/contexts/alert/alertContext";
import React, { useEffect } from "react";

export default function Alert() {
  const { error, message, setMessage } = useAlert();

  useEffect(() => {
    if (!message || message.length === 0) return;
    const timeout = setTimeout(() => setMessage(undefined), 3000);
    return () => clearTimeout(timeout);
  }, [message]);

  if (!message || message.length === 0) return null;

  /* .wv-toast: the same surface as the rail and the cards — top-right on desktop,
     clear of the rail and of the phone tab bar, 3s auto-dismiss kept */
  return (
    <div
      role={error ? "alert" : "status"}
      aria-live={error ? "assertive" : "polite"}
      className={`wv-toast${error ? " wv-toast--error" : ""}`}
    >
      <span aria-hidden="true" className="wv-toast-dot" />
      <p className="wv-toast-text">{message}</p>
      <button
        type="button"
        onClick={() => setMessage(undefined)}
        aria-label="Dismiss message"
        className="wv-btn wv-btn--quiet min-h-[44px] px-2"
      >
        <svg viewBox="0 0 24 24" className="od-icon [--od-icon-size:1rem]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true" focusable="false">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
  );
}
