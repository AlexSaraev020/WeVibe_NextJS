import React from 'react'
import Post from '@/components/cards/post'
export default function Page() {
  return (
    <div className='flex-1 p-4 flex justify-center h-screen'>
      <ul className='flex flex-col overflow-y-auto h-full w-full items-center'>
        <li className='w-full flex items-center justify-center'>
          <Post />
        </li>
      </ul>
    </div>
  )
}
