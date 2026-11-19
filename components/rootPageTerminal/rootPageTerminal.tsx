"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function RootPageTerminal() {
  const [showTerminal, setShowTerminal] = useState<boolean>(true);
  const router = useRouter();
  const handleGuest = () => {
    router.push("/home");
    if (typeof window !== "undefined") {
      document.cookie = "isGuest=true; path=/;";
    }
  };
  return (
    <div className="mt-8">
      {showTerminal ? (
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" id="getStartedButton" aria-label="Get started" onClick={() => setShowTerminal(false)} className="wv-btn wv-btn--primary">
            Get started
          </button>
          <a href="/home" className="wv-btn wv-btn--quiet">Read the feed first</a>
        </div>
      ) : (
        <div className="od-stack gap-4">
          <p className="m-0 max-w-[52ch] text-[var(--wv-text-base)] leading-[1.6] text-[var(--wv-mid)]">
            <span className="font-semibold text-[var(--wv-ink)]">An account</span> posts, likes and comments.
            <span className="font-semibold text-[var(--wv-ink)]"> A guest</span> can read the feed, the people
            list and any profile, but every write is refused until they sign in.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" id="loginButton" aria-label="Login" onClick={() => router.push("/auth/login")} className="wv-btn wv-btn--primary">
              Login
            </button>
            <button type="button" id="registerButton" aria-label="Register" onClick={() => router.push("/auth/register")} className="wv-btn">
              Register
            </button>
            <button type="button" aria-label="Continue as guest" onClick={handleGuest} className="wv-btn wv-btn--quiet">
              Continue as guest
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
