"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import { IoCloudUploadOutline } from "react-icons/io5";


export default function CreatePost() {
    const [image, setImage] = useState<string | null>(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }
    return (
        <div className='fixed bg-black/60 h-screen w-full z-50 inset-0 flex items-center justify-center'>
            <form className='bg-black/90 ease-in-out hover:bg-black/70 delay-100 md:w-4/12 border-2 border-gray-800 transition-all duration-1000 flex flex-col gap-6 p-6 rounded-xl shadow-glow shadow-white animate-fadeIn'>
                <h2 className='text-3xl py-1 md:text-5xl font-extrabold bg-gradient-to-r from-white via-gray-400 to-gray-200 text-center text-transparent bg-clip-text neon-text'>
                    Create Post
                </h2>
                <div className='flex flex-col gap-4'>
                    <label htmlFor="image-input">
                        {image ?
                            <Image
                                src={image}
                                alt="uploaded image"
                                width={100}
                                height={100}
                                className='w-full rounded-xl cursor-pointer'
                            />
                            :
                            <div className='w-full flex flex-col items-center transition-all duration-500 hover:scale-105 border-2 border-white/50 rounded-xl border-dotted p-4 py-10 md:py-20 cursor-pointer'>
                                <IoCloudUploadOutline className='w-10 h-10 stroke-white/50' />
                                <p className="mb-2 text-sm text-white/50 group-hover:text-white/80 transition-colors duration-300"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-white/50 group-hover:text-white/80 transition-colors duration-300">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                        }
                        <input onChange={handleImageChange} id='image-input' className='hidden' type="file" accept='image/*' />
                    </label>
                    <div className='flex flex-col gap-2'>
                        <label className='text-white/80' htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            placeholder='Enter post title'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-xl p-2 bg-black text-white placeholder:text-white/50"
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            placeholder='Enter post description'
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full rounded-xl p-2 bg-black text-white placeholder:text-white/50"
                        />
                    </div>
                </div>
                <div className='flex w-full items-center justify-start gap-10'>
                    <button className='bg-white/90 shadow-glow-sm hover:shadow-glow shadow-zinc-400/90 hover:shadow-white hover:bg-white transition-all duration-500 hover:scale-105 text-black text-lg font-extrabold py-2 w-32 rounded-xl '>
                        Create Post
                    </button>
                    <button className=' border-2 border-white/90 shadow-glow-sm hover:shadow-glow shadow-white/90 hover:shadow-white hover:border-white transition-all duration-500 hover:scale-105 text-lg font-extrabold py-2 w-32 rounded-xl '>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
