import React from "react";
import Image from "next/image";
import Logo from "@/public/icons/WeVibe.png";
import ResetPasswordForm from "@/components/forms/resetPasswordForm/resetPasswordForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
    const token = cookieStore.get("authToken");
    if (token) {
      redirect("/home");
    }
  const encryptedCode = cookieStore.get("resetCode");
  const encryptedMail = cookieStore.get("encryptedMail");
  
  return (
    <div className="flex h-[100dvh] flex-col items-center justify-center gap-10">
      <div className="flex animate-fadeIn items-center justify-center text-4xl font-extrabold transition-all duration-500 md:text-6xl">
        <h2 className="text-sky-100">We</h2>
        <Image src={Logo} alt="Logo" className="h-12 w-12 md:h-20 md:w-20" />
        <h2 className="text-sky-500">ibe</h2>
      </div>
      <ResetPasswordForm encryptedCode={encryptedCode?.value} encryptedMail={encryptedMail?.value} />
    </div>
  );
}
