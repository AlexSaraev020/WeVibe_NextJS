"use client"
import React, { use, useEffect, useState } from 'react'
import Logo from "@/public/icons/WeVibe.png"
import Image from 'next/image'
import { usePathname } from "next/navigation";
import { content } from './navcomponents/content';
import Logout from './navcomponents/prompts/logout';
import CreatePost from './navcomponents/prompts/createPost';



export default function Nav() {
  const paths = ["/", "/register"]
  const path = usePathname()
  const [showLogoutPrompt, setShowLogoutPrompt] = useState<boolean>(false)
  const [showCreatePost, setShowCreatePost] = useState<boolean>(false)
  useEffect(() => {
    document.body.style.overflow = showLogoutPrompt ? 'hidden' : 'auto'
  }, [showLogoutPrompt])
  const handleLogOut = () => {
    setShowLogoutPrompt(!showLogoutPrompt)
    console.log('showLogoutPrompt', showLogoutPrompt)
  }

  const handleSearch = () => {

  }

  const handleCreatePost = () => {
    setShowCreatePost(!showCreatePost)
  }

  const handleProfile = () => {

  }

  const navButtons = content({ handleCreatePost, handleSearch, handleLogOut, handleProfile })

  return (
    <>
      {showLogoutPrompt &&
        <Logout setShowLogoutPrompt={setShowLogoutPrompt} />
      }
      {showCreatePost &&
        <CreatePost />
      }
      {!paths.includes(path) &&
        <>
          <nav className='flex flex-row items-center gap-4 z-10 bg-black md:gap-0 justify-center md:justify-start md:items-start md:flex-col p-1 md:p-4 w-full h-fit order-2 md:order-1 fixed md:w-fit bottom-0 md:h-screen border-t-2 md:border-t-0 md:border-r-2 shadow-glow-sm shadow-white transition-all duration-500 animate-fadeIn'>
            <Image src={Logo} alt="WeVibe Logo" className='w-14 h-14 md:w-32 md:h-32' width={100} height={100} />
            <div className='flex flex-row md:flex-col md:py-10 md:px-2 gap-4 md:gap-8'>
              {navButtons.map((item) => (
                <button onClick={item.onClick} key={item.id} className='flex group relative items-center justify-start gap-2'>
                  {item.icon}
                  <h2 className='text-xl hidden md:block'>
                    {item.name}
                  </h2>
                  {item.tooltip}
                </button>
              ))}
            </div>
          </nav>

        </>
      }
    </>
  )
}
