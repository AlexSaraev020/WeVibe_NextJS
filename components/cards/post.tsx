import React from 'react'
import Image from 'next/image'
import Placeholder600x400 from '@/public/placeholders/600-400.png'
import Placeholder1080x1080 from '@/public/placeholders/1080-1080.png'
import Placeholder1920x1080 from '@/public/placeholders/1920-1080.png'
import PostBottomSide from './postComponents/clientSide'



export default function Post() {
    return (
        <div className=' flex flex-col w-full md:w-6/12 transition-all duration-500 animate-fadeIn'>
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
            <PostBottomSide />
        </div>
    )
}
