import Particles from '@/components/background/particles'
import Form from '@/components/login + register/form'
import { GradualSpacing } from '@/components/textAnimation/gradualSpacing'
import React from 'react'

export default function Page() {
  return (
    <div className="h-screen relative w-full flex flex-col gap-10 items-center justify-center transition-all duration-1000 animate-fadeIn">
      <h2 className={` text-6xl sm:text-7xl md:text-8xl font-extrabold flex`}>
          <GradualSpacing text="We" className="text-zinc-200 z-10" />
          <GradualSpacing text="Vibe" className="text-sky-500 z-10" />
      </h2>

      <Form className="z-10"/>
      <Particles
        className="absolute inset-0 z-0"
        quantity={200}
        ease={80}
        color={"#38bdf8"}
        refresh
      />
    </div>
  )
}
