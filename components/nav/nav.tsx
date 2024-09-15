"use client"
import React from 'react'
import Logo from "@/public/icons/WeVibe.png"
import Image from 'next/image'
import { usePathname } from "next/navigation";
import { content } from './navcomponents/content';



export default function Nav() {
  const paths = ["/", "/register"]
  const path = usePathname()
  return (
    <>
      {!paths.includes(path) &&
        <nav className='flex relative flex-col p-1 md:p-4 h-screen border-r-2 shadow-glow-sm shadow-white transition-all duration-500 animate-fadeIn'>
            <Image src={Logo} alt="WeVibe Logo" className='w-16 h-16 md:w-32 md:h-32' width={100} height={100} />
          <div className='flex flex-col py-10 px-2 gap-8'>
            {content.map((item) => (
              <button key={item.id} className='flex group relative items-center justify-start gap-2'>
                {item.icon}
                <h2 className='text-xl hidden md:block'>
                  {item.name}
                </h2>
                {item.tooltip}
              </button>
            ))}
          </div>
        </nav>
      }
    </>
  )
}
