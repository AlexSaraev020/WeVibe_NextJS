"use client";
import React, { useState } from "react";
import ShinyButton from "../buttons/shinyButton";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function RootPageTerminal() {
  const [showTerminal, setShowTerminal] = useState<boolean>(true);
  const router = useRouter();
  return (
    <div className="flex w-full items-center justify-center">
      {showTerminal ? (
        <ShinyButton
          onClick={() => setShowTerminal(false)}
          text="Get Started"
          type="button"
          className="text-xl text-sky-100 hover:text-sky-300"
        >
          <MdKeyboardArrowRight className="h-7 w-7 text-sky-100 transition-all duration-500 group-hover:text-sky-400" />
        </ShinyButton>
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <p className="w-10/12 animate-fadeIn text-center text-xs font-medium leading-relaxed text-sky-100 sm:w-8/12 sm:text-sm md:w-6/12 md:text-base">
            <span className="sm:text-md text-sm font-bold md:text-lg">
              We<span className="text-sky-400">Vibe</span>
            </span>{" "}
            is a place where every photo tells a story, every post is a personal
            touch, and every connection is an invitation to share something
            real. Our goal is to create a social experience that feels real and
            enjoyable. We&#39;re building a friendly community where you can be
            yourself.
          </p>
          <div className="flex gap-2 animate-fadeIn">
            <ShinyButton
              onClick={() => router.push("/login")}
              className="w-24 text-sm font-semibold text-sky-100 md:w-32 md:text-lg"
              text={"Login"}
            />
            <ShinyButton
              onClick={() => router.push("/register")}
              bottomLineCollor="bg-gradient-to-r from-sky-500/0 via-white/70 to-sky-500/0"
              topLineColor="bg-gradient-to-r from-sky-500/0 via-white/70 to-sky-500/0"
              className="w-24 bg-white/20 text-sm font-semibold hover:shadow-white/50 md:w-32 md:text-lg"
              text={"Register"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
