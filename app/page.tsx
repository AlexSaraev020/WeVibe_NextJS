import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GradualSpacing } from "@/components/textAnimation/gradualSpacing";
import Logo from "@/public/icons/WeVibe.png";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  if (token) {
    redirect("/home");
  }
  return (
    <div className="h-screen relative w-full flex flex-col gap-10 items-center justify-center transition-all duration-1000 animate-fadeIn">
      <h2 className={` text-7xl md:text-8xl font-extrabold flex`}>
        <GradualSpacing text="We" className="text-zinc-200 z-10" />
        <Image src={Logo} alt="Logo" className="w-20 h-18 md:w-24 md:h-24" />
        <GradualSpacing text="ibe" className="text-sky-500 z-10" />
      </h2>
      <div className="flex gap-6 z-10">
        <Link
          href={"/login"}
          className="bg-inherit border-2 flex items-center justify-center border-sky-600 font-bold text-white w-28 md:w-32 py-2 rounded-xl text-lg md:text-2xl hover:scale-105 transition-all duration-500 shadow-glow shadow-sky-600"
        >
          Login
        </Link>
        <Link
          href={"/register"}
          className="bg-sky-600 flex items-center justify-center text-white font-bold w-28 md:w-32 py-2 rounded-xl text-lg md:text-2xl hover:scale-105 transition-all duration-500"
        >
          Join us!
        </Link>
      </div>
    </div>
  );
}
