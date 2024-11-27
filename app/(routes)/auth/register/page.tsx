import React from "react";
import Form from "@/components/forms/authForm/form"
import Logo from "@/public/icons/WeVibe.png";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex h-screen w-full animate-fadeIn flex-col items-center justify-center gap-10 transition-all duration-1000">
      <div className="flex animate-fadeIn items-center justify-center text-7xl font-extrabold transition-all duration-500 md:text-8xl">
        <h2 className="text-sky-100">We</h2>
        <Image src={Logo} alt="Logo" className="h-18 w-20 md:h-28 md:w-28" />
        <h2 className="text-sky-500">ibe</h2>
      </div>
      <Form className="z-10" register />
    </div>
  );
}
