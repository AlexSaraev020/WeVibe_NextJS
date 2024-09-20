import React from "react";
import { Nerko_One } from "next/font/google";
import DotPattern from "../components/background/dot-pattern";
import { cn } from "@/lib/utils";
import Form from "../components/login + register/form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const nerkoOne = Nerko_One({
  subsets: ["latin"],
  weight: "400",
});
export default function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  if (token) {
    redirect("/home");
  }
  return (
    <div className="h-screen w-full flex flex-col gap-10 items-center justify-center transition-all duration-1000 animate-fadeIn">
      <h2
        className={`${nerkoOne.className} text-6xl sm:text-7xl md:text-8xl font-extrabold`}
      >
        We<span className="text-emerald-400">Vibe</span>
      </h2>

      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
          "md:[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]"
        )}
      />
      <Form />
    </div>
  );
}
