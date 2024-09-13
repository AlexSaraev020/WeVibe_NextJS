"use client"
import React, { useState } from 'react'
import ShinyButton from '../buttons/shiny-button'
import FormInput from './formElements/input'
import Link from 'next/link'
interface FormProps {
    register?: boolean
}
export default function Form({ register }: FormProps) {
    const [userName, setUserName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(userName, email, password)
    }
    return (
        <form
            className='w-10/12 md:w-3/6 lg:w-4/12 xl:w-3/12 border flex flex-col items-center justify-center bg-black py-10 z-10 gap-8 rounded-xl shadow-glow-sm shadow-white'
            onSubmit={handleSubmit}
        >
            <h2 className='text-4xl font-bold'>{register ? 'Register' : 'Login'}</h2>
            <div className='w-full flex flex-col justify-center items-center gap-4'>
                {register &&
                    <div className='w-9/12 flex flex-col gap-1'>
                        <FormInput onChange={(e) => setUserName(e.target.value)} type="text" name="Name" id="name" placeholder='Enter your name' required />
                    </div>
                }
                <div className='w-9/12 flex flex-col gap-1'>
                    <FormInput onChange={(e) => setEmail(e.target.value)} type="email" name="Email" id="email" placeholder='Enter your email' required />
                </div>
                <div className='w-9/12 flex flex-col gap-1'>
                    <FormInput onChange={(e) => setPassword(e.target.value)} type="password" name="Password" id="password" placeholder='Enter your password' required />
                </div>
            </div>
            <ShinyButton type='submit' text={register ? 'Register' : 'Login'} />
            <div className='flex gap-2'>
                <p>{register ? 'Already have an account?' : 'Don\'t have an account?'}</p>
                <Link className='text-emerald-400 font-bold' href={register ? '/' : '/register'}>{register ? ' Login ' : ' Register '}</Link>
            </div>
        </form>
    )
}
