import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Logo from "@/public/icons/WeVibe.png";
import Image from "next/image";
import RootPageTerminal from "@/components/rootPageTerminal/rootPageTerminal";

export default function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  if (token) {
    redirect("/home");
  }
  return (
    <div className="relative flex h-[100dvh] w-full animate-fadeIn flex-col items-center justify-center gap-10 transition-all duration-1000">
      <div className="flex items-center justify-center text-6xl font-extrabold md:text-8xl transition-all duration-500 animate-fadeIn">
        <h2 className="text-sky-100">We</h2>
        <Image src={Logo} alt="Logo" className="h-16 w-16 md:h-28 md:w-28" />
        <h2 className="text-sky-500">ibe</h2>
      </div>
      <RootPageTerminal />
    </div>
  );
}
