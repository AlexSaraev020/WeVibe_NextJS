import Form from "@/components/forms/authForm/form";
import Logo from "@/public/icons/WeVibe.png";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
   const cookieStore = await cookies();
    const token = cookieStore.get("authToken");
    if (token) {
      redirect("/home");
    }
  return (
    <div className="relative flex h-[100dvh] w-full animate-fadeIn flex-col items-center justify-center gap-10 transition-all duration-1000">
      <div className="flex animate-fadeIn items-center justify-center text-5xl font-extrabold transition-all duration-500 md:text-8xl">
        <h2 className="text-sky-100">We</h2>
        <Image src={Logo} alt="Logo" className="h-14 w-14 md:h-28 md:w-28" />
        <h2 className="text-sky-500">ibe</h2>
      </div>
      <Form className="z-10" />
    </div>
  );
}
