"use client"
import React, { useState } from 'react'
import ShinyButton from '../buttons/shiny-button'
import FormInput from './formElements/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { registerUser } from '@/actions/auth/register'
import { loginUser } from '@/actions/auth/login'
interface FormProps {
    register?: boolean
}
export default function Form({ register }: FormProps) {
    const [userName, setUserName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [success, setSuccess] = useState<string | undefined>(undefined)
    const [failure, setFailure] = useState<string | undefined>(undefined)
    const router = useRouter()
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        {
            register ?
                await registerUser({ userName, email, password, setSuccess, setFailure, router })
                :
                await loginUser({ email, password, setSuccess, setFailure, router })
        }
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
            <p className='text-emerald-400 font-bold text-center'>{success}</p>
            <p className='text-red-400 font-bold text-center max-w-sm'>{failure}</p>
            <div className='flex gap-2'>
                <p>{register ? 'Already have an account?' : 'Don\'t have an account?'}</p>
                <Link className='text-emerald-400 font-bold' href={register ? '/' : '/register'}>{register ? ' Login ' : ' Register '}</Link>
            </div>
        </form>
    )
}
