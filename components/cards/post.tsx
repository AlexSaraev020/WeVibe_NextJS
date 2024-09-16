"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Placeholder600x400 from '@/public/placeholders/600-400.png'
import Placeholder1080x1080 from '@/public/placeholders/1080-1080.png'
import Placeholder1920x1080 from '@/public/placeholders/1920-1080.png'
import Tooltip from '../nav/navcomponents/tooltip'
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoIosCloseCircle } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { FaComment } from "react-icons/fa";


export default function Post() {
    const [like, setLike] = useState<number | undefined>(undefined)
    const [dislike, setDislike] = useState<number | undefined>(undefined)
    const [truncate, setTruncate] = useState<boolean>(true)
    const handleLike = () => {
        if (like === undefined && dislike === undefined) {
            setLike(1)
        } else if(like === undefined && dislike !== undefined) {
            setDislike(undefined)
            setLike(1)
        }else{
            setLike(undefined)
        }
    }
    const handleDislike = () => {
        if (dislike === undefined && like === undefined) {
            setDislike(1)
        } else if(dislike === undefined && like !== undefined) {
            setLike(undefined)
            setDislike(1)
        }else{
            setDislike(undefined)
        }
    }
    return (
        <div className=' flex flex-col border w-full md:w-6/12 transition-all duration-500 animate-fadeIn'>
            <div className='flex items-center p-2 md:p-0'>
                <Image
                    src={Placeholder600x400}
                    alt="Placeholder"
                    className='w-9 h-9 md:w-14 md:h-14 rounded-full p-1 md:p-3'
                    width={400} height={400}
                />
                <h1 className='text-sm md:text-lg font-bold'>alexandru</h1>
            </div>
            <Image
                src={Placeholder1920x1080}
                alt="Placeholder"
                className='w-full h-full object-cover'
                width={1080}
                height={1080}
            />
            <div className='flex p-2 gap-2'>
                <button onClick={handleLike} className='relative group'>
                    {like === 1 ? <IoIosCheckmarkCircle className='w-10 h-10' /> : <IoIosCheckmarkCircleOutline className='w-10 h-10' />}
                    <Tooltip text='Like' />
                </button>
                <button onClick={handleDislike} className='relative group'>
                    {dislike === 1 ? <IoIosCloseCircle className='w-10 h-10' /> : <IoIosCloseCircleOutline className='w-10 h-10' />}
                    <Tooltip text='Dislike' />
                </button>
                <button className='relative group'>
                    <FaRegComment className='w-9 h-10 ml-1' />
                    <Tooltip text='Comment' />
                </button>
            </div>
            <div className='px-2 w-full flex flex-col gap-1'>
                <p className='truncate text-sm md:text-lg'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aperiam voluptates earum atque tenetur veritatis cupiditate nam velit? Explicabo, quia atque.</p>
                <h2 className='text-xs md:text-md text-zinc-300/90'>Comments 2.5k</h2>
                <h2>24/02/2023</h2>
            </div>
        </div>
    )
}
