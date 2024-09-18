import React from 'react'
import Post from '@/components/cards/post'
export default function Page() {
  return (
    <div className='flex-1 md:p-4 flex justify-center'>
      <ul className='flex flex-col w-full items-center gap-20 py-20'>
        <li className='w-full flex items-center justify-center h-full'>
          <Post />
        </li>
        <li className='w-full flex items-center justify-center h-full'>
          <Post />
        </li>
        <li className='w-full flex items-center justify-center h-full'>
          <Post />
        </li>
      </ul>
    </div>
  )
}
