import React from 'react'
import DotPattern from '../../../components/background/dot-pattern'
import Form from '../../../components/login + register/form'
import {Nerko_One} from "next/font/google";
import { cn } from '../../../lib/utils';


const nerkoOne = Nerko_One({
  subsets: ["latin"],
  weight: "400"
});
export default function Page() {
  return (
    <div className="h-screen w-full flex flex-col gap-10 items-center justify-center transition-all duration-1000 animate-fadeIn">
      <h2 className={`${nerkoOne.className} text-6xl sm:text-7xl md:text-8xl font-extrabold`}>We<span className="text-emerald-400">Vibe</span></h2>

      <DotPattern className={cn(
        "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
        "md:[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]"
      )} />
      <Form register/>
    </div>
  )
}
