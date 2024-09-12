import React from "react";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import Form from "./components/login + register/form";
export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <DotPattern className={cn(
        "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
        "md:[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]"
      )} />
        <Form />
    </div>
  );
}
