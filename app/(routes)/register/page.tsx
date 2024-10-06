import React from "react";
import Form from "../../../components/login + register/form";
import Logo from "@/public/icons/WeVibe.png";
import Image from "next/image";
import { GradualSpacing } from "@/components/textAnimation/gradualSpacing";

export default function Page() {
  return (
    <div className="h-screen w-full flex flex-col gap-10 items-center justify-center transition-all duration-1000 animate-fadeIn">
      <h2 className={` text-6xl sm:text-7xl md:text-8xl font-extrabold flex`}>
        <GradualSpacing text="We" className="text-zinc-200 z-10" />
        <Image src={Logo} alt="Logo" className="w-20 h-18 md:w-24 md:h-24" />
        <GradualSpacing text="ibe" className="text-sky-500 z-10" />
      </h2>

      <Form className="z-10" register />
    </div>
  );
}
